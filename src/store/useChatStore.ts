import { create } from 'zustand';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface ChatState {
    messages: Message[];
    isTyping: boolean;
    addMessage: (role: 'user' | 'assistant', content: string) => void;
    clearChat: () => void;
    setIsTyping: (isTyping: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hello! I am your research assistant. How can I help you with your paper today?',
            timestamp: Date.now(),
        },
    ],
    isTyping: false,
    addMessage: (role, content) =>
        set((state) => ({
            messages: [
                ...state.messages,
                {
                    id: crypto.randomUUID(),
                    role,
                    content,
                    timestamp: Date.now(),
                },
            ],
        })),
    clearChat: () => set({ messages: [] }),
    setIsTyping: (isTyping) => set({ isTyping }),
}));
