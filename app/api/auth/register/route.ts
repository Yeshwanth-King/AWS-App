import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/app/lib/prisma"
import { setAuthCookie } from "@/app/lib/auth"

export async function POST(request: NextRequest) {
    try {
        const { email, username, password, name } = await request.json()

        // Validation
        if (!email || !username || !password) {
            return NextResponse.json(
                { error: "Email, username, and password are required" },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email or username already exists" },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
                name: name || username,
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                avatar: true,
                uploadCount: true,
                createdAt: true,
            }
        })

        // Set authentication cookie
        await setAuthCookie(user)

        return NextResponse.json({
            message: "User created successfully",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                avatar: user.avatar,
            }
        })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
