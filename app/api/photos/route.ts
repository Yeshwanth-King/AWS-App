import { prisma } from "@/app/lib/prisma";
import { Client } from "@/app/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer"; // 


export async function GET() {
    try {
        // Your GET logic here
        const photos = await prisma.post.findMany();
        for (const post of photos) {
            const url = `${process.env.CLOUDFRONT_DOMAIN}/${post.content}`;
            post.content = getSignedUrl({
                url,
                keyPairId: process.env.CLOUDFRONT_PUBLIC_KEY!,
                privateKey: process.env.CLOUDFRONT_PRIVATE_KEY!,
                dateLessThan: new Date(Date.now() + (1000 * 60 * 10))
            })
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
    try {
        const formData = await request.formData();
        const file = formData.get("photo");
        const caption = formData.get("caption");

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }


        const buffer = Buffer.from(await file.arrayBuffer());
        const key = Date.now() + "-" + file.name;


        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: key,
            Body: buffer,
            ContentType: file.type
        });

        await Client.send(command)

        const photo = await prisma.post.create({
            data: {
                content: key,
                title: caption ? caption.toString() : "", // Assuming 'title' is a field in your Post model
                slug: key.replace(/\.[^/.]+$/, ""), // Remove file extension for slug
            },
        });

        return NextResponse.json({
            message: "POST request successful",
            photo
        });
    } catch (error) {
        console.error("POST request failed:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
