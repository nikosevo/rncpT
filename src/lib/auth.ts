import { supabase } from './supabase';

export interface User {
    id: string;
    email: string;
}

export const login = async (email: string, password: string): Promise<User | null> => {
    if (!supabase) {
        alert('Supabase is not configured. Please add credentials to .env');
        return null;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error('Login error:', error);
        return null;
    }

    if (data.user) {
        return {
            id: data.user.id,
            email: data.user.email || '',
        };
    }

    return null;
};

export const logout = async (): Promise<void> => {
    if (!supabase) return;
    await supabase.auth.signOut();
};

export const getCurrentUser = async (): Promise<User | null> => {
    if (!supabase) return null;

    const { data: { session } } = await supabase.auth.getSession();

    if (session?.user) {
        return {
            id: session.user.id,
            email: session.user.email || '',
        };
    }

    return null;
};

// Get current user synchronously from session (for immediate use)
export const getCurrentUserSync = (): User | null => {
    // This is a fallback - we'll rely on the auth store for the current user
    return null;
};
