'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
    uploadCount: number;
    id: string;
    email: string;
    username: string;
    name: string | null;
    avatar: string | null;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signUp: (email: string, username: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Session check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Sign in failed' };
            }
        } catch {
            return { success: false, error: 'Network error' };
        }
    };

    const signUp = async (email: string, username: string, password: string, name?: string) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password, name }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Sign up failed' };
            }
        } catch {
            return { success: false, error: 'Network error' };
        }
    };

    const signOut = async () => {
        try {
            await fetch('/api/auth/signout', {
                method: 'POST',
            });
        } catch (error) {
            console.error('Sign out error:', error);
        } finally {
            setUser(null);
        }
    };

    const refreshUser = async () => {
        await checkSession();
    };

    const value = {
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
