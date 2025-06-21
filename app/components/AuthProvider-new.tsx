'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/app/lib/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (email: string, username: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>;
    signout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const signin = async (email: string, password: string) => {
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
                return { success: false, error: data.error };
            }
        } catch {
            return { success: false, error: 'An error occurred during signin' };
        }
    };

    const signup = async (email: string, username: string, password: string, name?: string) => {
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
                return { success: false, error: data.error };
            }
        } catch {
            return { success: false, error: 'An error occurred during signup' };
        }
    };

    const signout = async () => {
        try {
            await fetch('/api/auth/signout', {
                method: 'POST',
            });
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, signin, signup, signout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
