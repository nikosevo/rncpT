import { create } from 'zustand';
import { login as authLogin, logout as authLogout, getCurrentUser } from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { User } from '../lib/auth';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: async (email: string, password: string) => {
        const user = await authLogin(email, password);
        if (user) {
            set({ user, isAuthenticated: true });
            return true;
        }
        return false;
    },
    logout: async () => {
        await authLogout();
        set({ user: null, isAuthenticated: false });
    },
    initialize: async () => {
        const user = await getCurrentUser();
        if (user) {
            set({ user, isAuthenticated: true });
        }

        // Listen for auth changes
        if (supabase) {
            supabase.auth.onAuthStateChange((_event, session) => {
                if (session?.user) {
                    set({
                        user: {
                            id: session.user.id,
                            email: session.user.email || '',
                        },
                        isAuthenticated: true,
                    });
                } else {
                    set({ user: null, isAuthenticated: false });
                }
            });
        }
    },
}));
