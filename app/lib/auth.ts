import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key-here'
);

export interface User {
    id: string;
    email: string;
    username: string;
    name: string | null;
    avatar: string | null;
    uploadCount: number;
}

export interface SessionPayload {
    userId: string;
    email: string;
    username: string;
    name: string | null;
    iat?: number;
    exp?: number;
}

export class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}

// Create JWT token
export async function createToken(payload: Omit<SessionPayload, 'iat' | 'exp'>): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SessionPayload> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as unknown as SessionPayload;
    } catch {
        throw new AuthError('Invalid token');
    }
}

// Get current user from session
export async function getCurrentUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return null;
        }

        const payload = await verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                avatar: true,
                uploadCount: true,
            },
        });

        return user;
    } catch {
        return null;
    }
}

// Get user from request (for API routes)
export async function getUserFromRequest(request: NextRequest): Promise<User | null> {
    try {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return null;
        }

        const payload = await verifyToken(token);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                avatar: true,
                uploadCount: true,
            },
        });

        return user;
    } catch {
        return null;
    }
}

// Require authentication for API routes
export async function requireAuth(request: NextRequest): Promise<User> {
    const user = await getUserFromRequest(request);

    if (!user) {
        throw new AuthError('Authentication required');
    }

    return user;
}

// Set auth cookie
export async function setAuthCookie(user: User): Promise<string> {
    const token = await createToken({
        userId: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
    });

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });

    return token;
}

// Clear auth cookie
export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete('auth-token');
}

// Check if user is authenticated (for middleware)
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
    try {
        const token = request.cookies.get('auth-token')?.value;

        if (!token) {
            return false;
        } await verifyToken(token);
        return true;
    } catch {
        return false;
    }
}
