import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

// GET likes for a specific post
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const postId = searchParams.get('postId')

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            )
        }

        const likes = await prisma.like.findMany({
            where: { postId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        name: true,
                        avatar: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        const likesCount = await prisma.like.count({
            where: { postId }
        })

        return NextResponse.json({
            likes,
            count: likesCount
        })
    } catch (error) {
        console.error("Error fetching likes:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// POST toggle like
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth(request)

        const { postId } = await request.json()

        if (!postId) {
            return NextResponse.json(
                { error: "Post ID is required" },
                { status: 400 }
            )
        }

        // Check if post exists
        const post = await prisma.post.findUnique({
            where: { id: postId }
        })

        if (!post) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            )
        }        // Check if user already liked this post
        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId: user.id,
                }
            }
        })

        if (existingLike) {
            // Unlike - remove the like
            await prisma.like.delete({
                where: { id: existingLike.id }
            })

            const likesCount = await prisma.like.count({
                where: { postId }
            })

            return NextResponse.json({
                liked: false,
                count: likesCount,
                message: "Post unliked"
            })
        } else {
            // Like - add the like
            await prisma.like.create({
                data: {
                    postId,
                    userId: user.id,
                }
            })

            const likesCount = await prisma.like.count({
                where: { postId }
            })

            return NextResponse.json({
                liked: true,
                count: likesCount,
                message: "Post liked"
            })
        }
    } catch (error) {
        console.error("Error toggling like:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
