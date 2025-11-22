import React, { useState } from 'react';
import { usePaperStore } from '../store/usePaperStore';
import { useAuthStore } from '../store/useAuthStore';
import { Plus, Trash2, BookOpen, Type, Sparkles, LogOut } from 'lucide-react';

export const EditorPanel: React.FC = () => {
    const { sections, addSection, removeSection, updateSection, currentDraftId, currentDraftTitle, updateDraft } = usePaperStore();
    const { user, logout } = useAuthStore();
    const [updating, setUpdating] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleStartEdit = () => {
        setEditTitle(currentDraftTitle || 'Updated Draft');
        setIsEditingTitle(true);
    };

    const handleCancelEdit = () => {
        setIsEditingTitle(false);
        setEditTitle('');
    };

    const handleUpdate = async () => {
        if (!currentDraftId || !editTitle.trim()) return;

        setUpdating(true);
        try {
            await updateDraft(currentDraftId, editTitle.trim());
            setIsEditingTitle(false);
            setEditTitle('');
            alert('Draft updated successfully!');
        } catch (error: any) {
            console.error('Failed to update draft', error);
            alert(`Failed to update draft: ${error?.message || 'Unknown error'}`);
        } finally {
            setUpdating(false);
        }
    };

    const getInitials = (email: string) => {
        const name = email.split('@')[0];
        return name.slice(0, 2).toUpperCase();
    };

    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                {/* Main header row */}
                <div className="flex justify-between items-center gap-3 flex-wrap">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-slate-800 tracking-tight">
                            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                                <Type className="w-5 h-5 text-blue-600" />
                            </div>
                            Drafting
                        </h2>
                        <p className="text-xs text-slate-500 mt-1 ml-1">Write your ideas, we handle the rest.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {currentDraftId && !isEditingTitle && (
                            <button
                                onClick={handleStartEdit}
                                className="group flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg text-white text-sm font-medium transition-all shadow-md shadow-emerald-200 hover:shadow-lg"
                            >
                                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Update Draft
                            </button>
                        )}

                        <button
                            onClick={addSection}
                            className="group flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg text-white text-sm font-medium transition-all shadow-md shadow-blue-200 hover:shadow-lg"
                        >
                            <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Add Section
                        </button>

                        {/* Profile Avatar */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold flex items-center justify-center hover:shadow-lg transition-shadow border-2 border-white shadow-md"
                                title={user?.email}
                            >
                                {user && getInitials(user.email)}
                            </button>

                            {showProfileMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowProfileMenu(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-20">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-sm font-medium text-slate-800">{user?.email}</p>
                                            <p className="text-xs text-slate-500 mt-1">Signed in</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                logout();
                                            }}
                                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Edit form - appears below on its own row */}
                {isEditingTitle && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdate();
                                if (e.key === 'Escape') handleCancelEdit();
                            }}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="Draft title..."
                            autoFocus
                        />
                        <button
                            onClick={handleUpdate}
                            disabled={updating || !editTitle.trim()}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updating ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            disabled={updating}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium rounded-lg disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-slate-50/50">
                {sections.map((section, index) => (
                    <div key={section.id} className="group bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-6 space-y-4 transition-all duration-300 shadow-sm hover:shadow-md">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 block">Section {index + 1}</label>
                                <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                                    className="bg-transparent text-xl font-semibold text-slate-800 focus:outline-none focus:ring-0 w-full placeholder-slate-300"
                                    placeholder="Untitled Section"
                                />
                            </div>
                            <button
                                onClick={() => removeSection(section.id)}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove Section"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Key Points & Math
                            </label>
                            <textarea
                                value={section.content}
                                onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                                className="w-full h-40 bg-slate-50 border border-slate-200 focus:border-blue-400 rounded-lg p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-100 font-mono text-slate-700 resize-none transition-all"
                                placeholder="- Describe your main idea here...&#10;- Use LaTeX for math: E = mc^2"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                                <BookOpen className="w-3 h-3 text-emerald-500" />
                                Citations
                            </label>
                            <input
                                type="text"
                                value={section.citations.join(', ')}
                                onChange={(e) => updateSection(section.id, 'citations', e.target.value.split(',').map(c => c.trim()))}
                                className="w-full bg-slate-50 border border-slate-200 focus:border-emerald-400 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                                placeholder="e.g., Smith 2020, Doe et al. 2023"
                            />
                        </div>
                    </div>
                ))}

                {sections.length === 0 && (
                    <div className="text-center py-20 text-slate-400">
                        <p>No sections yet. Click "Add Section" to start writing.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
