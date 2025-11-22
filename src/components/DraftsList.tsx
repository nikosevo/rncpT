import React, { useEffect, useState } from 'react';
import { usePaperStore } from '../store/usePaperStore';
import type { Draft } from '../lib/supabase';
import { FileText, Clock, X, Loader2 } from 'lucide-react';

interface DraftsListProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DraftsList: React.FC<DraftsListProps> = ({ isOpen, onClose }) => {
    const { loadDrafts, setSections, saveDraft, setCurrentDraftId, setCurrentDraftTitle, dbError, dismissDbError } = usePaperStore();
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [loading, setLoading] = useState(false);
    const [newDraftTitle, setNewDraftTitle] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchDrafts();
        }
    }, [isOpen]);

    const fetchDrafts = async () => {
        setLoading(true);
        try {
            const data = await loadDrafts();
            setDrafts(data || []);
        } catch (error) {
            console.error('Failed to load drafts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoad = (draft: Draft) => {
        setSections(draft.content);
        setCurrentDraftId(draft.id);
        setCurrentDraftTitle(draft.title);
        onClose();
    };

    const handleSave = async () => {
        if (!newDraftTitle.trim()) return;
        setSaving(true);
        try {
            await saveDraft(newDraftTitle);
            setNewDraftTitle('');
            fetchDrafts(); // Refresh list
        } catch (error: any) {
            console.error('Failed to save draft', error);
            const errorMessage = error?.message || 'Unknown error';
            if (errorMessage.includes('user_id') || error?.code === '42703') {
                alert('Database error: The user_id column is missing.\n\nPlease run this SQL in Supabase:\nALTER TABLE drafts ADD COLUMN user_id TEXT;');
            } else {
                alert(`Failed to save draft: ${errorMessage}`);
            }
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-96 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Saved Drafts</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {dbError && (
                    <div className="p-4 bg-red-50 border-b border-red-100 text-red-700 text-xs">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold">Database Error</span>
                            <button onClick={dismissDbError}><X className="w-3 h-3" /></button>
                        </div>
                        <p className="mb-2">{dbError}</p>
                        <p className="font-semibold">Run this SQL in Supabase:</p>
                        <pre className="bg-red-100 p-2 rounded mt-1 overflow-x-auto select-all text-[10px]">
                            {`create table drafts (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text,
  content jsonb,
  user_id text
);
alter table drafts enable row level security;
create policy "Allow all operations" on drafts for all using (true) with check (true);`}
                        </pre>
                    </div>
                )}

                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Save Current Draft</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newDraftTitle}
                            onChange={(e) => setNewDraftTitle(e.target.value)}
                            placeholder="Draft Title..."
                            className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                        <button
                            onClick={handleSave}
                            disabled={saving || !newDraftTitle.trim()}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                        </div>
                    ) : drafts.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">
                            No saved drafts found.
                        </div>
                    ) : (
                        drafts.map((draft) => (
                            <button
                                key={draft.id}
                                onClick={() => handleLoad(draft)}
                                className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{draft.title}</h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                            <Clock className="w-3 h-3" />
                                            {new Date(draft.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
