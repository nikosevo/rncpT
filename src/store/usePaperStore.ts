import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Draft } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';

export interface Section {
    id: string;
    title: string;
    content: string; // Bullet points
    citations: string[];
}

interface PaperState {
    sections: Section[];
    generatedContent: string;
    isGenerating: boolean;
    addSection: () => void;
    removeSection: (id: string) => void;
    updateSection: (id: string, field: keyof Section, value: any) => void;
    setGeneratedContent: (content: string) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setSections: (sections: Section[]) => void;
    saveDraft: (title: string) => Promise<void>;
    loadDrafts: () => Promise<Draft[]>;
    updateDraft: (id: string, title: string) => Promise<void>;
    currentDraftId: string | null;
    currentDraftTitle: string | null;
    setCurrentDraftId: (id: string | null) => void;
    setCurrentDraftTitle: (title: string | null) => void;
    dbError: string | null;
    dismissDbError: () => void;
}

export const usePaperStore = create<PaperState>((set, get) => ({
    sections: [
        {
            id: '1',
            title: 'Introduction',
            content: '- The problem is X\n- We propose Y\n- E = mc^2',
            citations: ['Smith et al. 2020'],
        },
    ],
    generatedContent: '',
    isGenerating: false,
    dbError: null,
    currentDraftId: null,
    currentDraftTitle: null,
    dismissDbError: () => set({ dbError: null }),
    setCurrentDraftId: (id) => set({ currentDraftId: id }),
    setCurrentDraftTitle: (title) => set({ currentDraftTitle: title }),
    addSection: () =>
        set((state) => ({
            sections: [
                ...state.sections,
                {
                    id: crypto.randomUUID(),
                    title: 'New Section',
                    content: '',
                    citations: [],
                },
            ],
        })),
    removeSection: (id) =>
        set((state) => ({
            sections: state.sections.filter((s) => s.id !== id),
        })),
    updateSection: (id, field, value) =>
        set((state) => ({
            sections: state.sections.map((s) =>
                s.id === id ? { ...s, [field]: value } : s
            ),
        })),
    setGeneratedContent: (content) => set({ generatedContent: content }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setSections: (sections) => set({ sections }),
    saveDraft: async (title) => {
        if (!supabase) {
            console.warn('Supabase not configured');
            alert('Please configure Supabase credentials in .env to save drafts.');
            return;
        }
        const user = useAuthStore.getState().user;
        if (!user) {
            alert('You must be logged in to save drafts.');
            return;
        }
        try {
            const { sections } = get();
            const { error } = await supabase.from('drafts').insert({
                title,
                content: sections,
                user_id: user.id,
            });
            if (error) {
                console.error('Supabase save error:', error);
                if (error.code === '42703') {
                    set({ dbError: 'The user_id column is missing. Please run: ALTER TABLE drafts ADD COLUMN user_id TEXT;' });
                }
                throw error;
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            throw error;
        }
    },
    updateDraft: async (id, title) => {
        if (!supabase) {
            console.warn('Supabase not configured');
            alert('Please configure Supabase credentials in .env to update drafts.');
            return;
        }
        const user = useAuthStore.getState().user;
        if (!user) {
            alert('You must be logged in to update drafts.');
            return;
        }
        try {
            const { sections } = get();
            console.log('UPDATE DRAFT - ID:', id);
            console.log('UPDATE DRAFT - User ID:', user.id);
            console.log('UPDATE DRAFT - Title:', title);
            console.log('UPDATE DRAFT - Sections:', sections);

            const { data, error } = await supabase
                .from('drafts')
                .update({
                    title,
                    content: sections,
                })
                .eq('id', id)
                .eq('user_id', user.id)
                .select();

            console.log('UPDATE DRAFT - Response data:', data);
            console.log('UPDATE DRAFT - Response error:', error);

            if (error) {
                console.error('Supabase update error:', error);
                throw error;
            }

            if (!data || data.length === 0) {
                console.warn('UPDATE DRAFT - No rows were updated! This means the id/user_id combination was not found.');
                alert('Warning: No draft was updated. The draft may not exist or belong to a different user.');
            }

            // Update the current draft title in state
            set({ currentDraftTitle: title });
        } catch (error) {
            console.error('Error updating draft:', error);
            throw error;
        }
    },
    loadDrafts: async () => {
        if (!supabase) {
            console.warn('Supabase not configured');
            return [];
        }
        const user = useAuthStore.getState().user;
        if (!user) {
            return [];
        }
        const { data, error } = await supabase
            .from('drafts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Supabase error:', error);
            if (error.code === '42P01' || error.message.includes('404')) {
                set({ dbError: 'Table "drafts" does not exist. Please run the SQL setup script.' });
            }
            throw error;
        }
        return data as Draft[];
    },
}));
