import { NextResponse } from "next/server"
import { clearAuthCookie } from "@/app/lib/auth"

export async function POST() {
    try {
        // Clear the authentication cookie
        await clearAuthCookie()

        return NextResponse.json({
            message: "Signed out successfully"
        })
    } catch (error) {
        console.error("Sign out error:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
