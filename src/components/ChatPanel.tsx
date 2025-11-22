import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { chatWithLLM } from '../lib/llmService';
import { Send, Bot, Sparkles } from 'lucide-react';

export const ChatPanel: React.FC = () => {
    const { messages, addMessage, isTyping, setIsTyping } = useChatStore();
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        addMessage('user', userMessage);
        setIsTyping(true);

        // Prepare history for the API
        const history = messages.map(m => ({ role: m.role, content: m.content }));
        history.push({ role: 'user', content: userMessage });

        const response = await chatWithLLM(history);

        setIsTyping(false);
        addMessage('assistant', response);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white border-l border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                        <Bot className="w-5 h-5 text-purple-600" />
                    </div>
                    Assistant
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-4 shadow-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                            <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-slate-100 bg-white">
                <div className="relative flex items-center">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 resize-none shadow-inner"
                        rows={1}
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-lg transition-all shadow-md shadow-purple-200 disabled:shadow-none"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
