import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

// GET comments for a specific post
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

        const comments = await prisma.comment.findMany({
            where: { postId },
            include: {
                author: {
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

        return NextResponse.json({ comments })
    } catch (error) {
        console.error("Error fetching comments:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// POST new comment
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth(request)

        const { content, postId } = await request.json()

        if (!content || !postId) {
            return NextResponse.json(
                { error: "Content and post ID are required" },
                { status: 400 }
            )
        }

        if (content.trim().length === 0) {
            return NextResponse.json(
                { error: "Comment cannot be empty" },
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
        } const comment = await prisma.comment.create({
            data: {
                content: content.trim(),
                postId,
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
                }
            }
        })

        return NextResponse.json({ comment })
    } catch (error) {
        console.error("Error creating comment:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// DELETE comment
export async function DELETE(request: NextRequest) {
    try {
        const user = await requireAuth(request)

        const { searchParams } = new URL(request.url)
        const commentId = searchParams.get('commentId')

        if (!commentId) {
            return NextResponse.json(
                { error: "Comment ID is required" },
                { status: 400 }
            )
        }

        // Check if comment exists and user owns it
        const comment = await prisma.comment.findUnique({
            where: { id: commentId }
        })

        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            )
        }

        if (comment.authorId !== user.id) {
            return NextResponse.json(
                { error: "You can only delete your own comments" },
                { status: 403 }
            )
        }

        await prisma.comment.delete({
            where: { id: commentId }
        })

        return NextResponse.json({ message: "Comment deleted successfully" })
    } catch (error) {
        console.error("Error deleting comment:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
