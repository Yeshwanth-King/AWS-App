import { prisma } from "@/app/lib/prisma";
import { Client } from "@/app/lib/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { requireAuth } from "@/app/lib/auth";

// File size limits
const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
const MAX_VIDEO_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_USER_UPLOADS = 5;

// Allowed file types
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];

export async function GET() {
    try {
        const photos = await prisma.post.findMany({
            where: { published: true },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Generate signed URLs for each photo/video
        for (const post of photos) {
            const url = `${process.env.CLOUDFRONT_DOMAIN}/${post.content}`;
            post.content = getSignedUrl({
                url,
                keyPairId: process.env.CLOUDFRONT_PUBLIC_KEY!,
                privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
                dateLessThan: new Date(Date.now() + (1000 * 60 * 10)) // 10 minutes
            });
        }

        return NextResponse.json({ photos });
    } catch (error) {
        console.error("GET request failed:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    let key: string = '';
    try {
        // Check authentication
        const user = await requireAuth(request);

        // Check user's upload count
        if (user.uploadCount >= MAX_USER_UPLOADS) {
            return NextResponse.json(
                { error: `Maximum upload limit reached. You can only upload ${MAX_USER_UPLOADS} files.` },
                { status: 400 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("photo");
        const caption = formData.get("caption");

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validate file type and size
        const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
        const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

        if (!isImage && !isVideo) {
            return NextResponse.json(
                { error: "Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, OGG, AVI, MOV) are allowed." },
                { status: 400 }
            );
        }

        // Check file size limits
        if (isImage && file.size > MAX_IMAGE_SIZE) {
            return NextResponse.json(
                { error: `Image files must be smaller than ${MAX_IMAGE_SIZE / (1024 * 1024)}MB` },
                { status: 400 }
            );
        }

        if (isVideo && file.size > MAX_VIDEO_SIZE) {
            return NextResponse.json(
                { error: `Video files must be smaller than ${MAX_VIDEO_SIZE / (1024 * 1024)}MB` },
                { status: 400 }
            );
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        key = `${Date.now()}-${user.id}-${file.name}`;

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: file.type,
            Metadata: {
                userId: user.id,
                originalName: file.name,
                uploadedAt: new Date().toISOString(),
            }
        });

        await Client.send(command);

        // Create post in database
        const photo = await prisma.post.create({
            data: {
                content: key,
                title: caption ? caption.toString() : "",
                slug: key.replace(/\.[^/.]+$/, ""),
                fileType: isImage ? 'image' : 'video', fileSize: file.size,
                mimeType: file.type,
                published: true,
                authorId: user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            }
        });        // Update user's upload count
        await prisma.user.update({
            where: { id: user.id },
            data: { uploadCount: { increment: 1 } }
        });

        return NextResponse.json({
            message: "File uploaded successfully",
            photo
        });
    } catch (error) {
        if (key) {
            // Clean up uploaded file in S3 if an error occurs
            try {
                await Client.send(new DeleteObjectCommand({
                    Bucket: process.env.S3_BUCKET_NAME!,
                    Key: key
                }));
            } catch (cleanupError) {
                console.error("Failed to delete file from S3:", cleanupError);
            }
        }
        console.error("POST request failed:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
