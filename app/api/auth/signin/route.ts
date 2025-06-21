import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/app/lib/prisma"
import { setAuthCookie } from "@/app/lib/auth"

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                avatar: true,
                uploadCount: true,
                password: true,
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            )
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            )
        }        // Remove password from user object
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user

        // Set authentication cookie
        await setAuthCookie(userWithoutPassword)

        return NextResponse.json({
            message: "Signed in successfully",
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                avatar: user.avatar,
            }
        })
    } catch (error) {
        console.error("Sign in error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
