import React from 'react';

interface LayoutProps {
    leftPanel: React.ReactNode;
    rightPanel: React.ReactNode;
    chatPanel: React.ReactNode;
    onOpenDrafts: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ leftPanel, rightPanel, chatPanel, onOpenDrafts }) => {
    return (
        <div className="flex h-screen w-full bg-slate-50 text-slate-800 overflow-hidden font-sans">
            <div className="w-[35%] h-full border-r border-slate-200 flex flex-col bg-white shadow-xl z-10 relative">
                <button
                    onClick={onOpenDrafts}
                    className="absolute top-4 left-4 z-50 p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                    title="Open Drafts"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </button>
                {leftPanel}
            </div>
            <div className="w-[40%] h-full flex flex-col bg-slate-50 relative">
                {rightPanel}
            </div>
            <div className="w-[25%] h-full flex flex-col bg-white border-l border-slate-200 z-10">
                {chatPanel}
            </div>
        </div>
    );
};
