import React, { useState, useEffect } from 'react';
import { usePaperStore } from '../store/usePaperStore';
import { FileText, RefreshCw } from 'lucide-react';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'phi3';

export const PreviewPanel: React.FC = () => {
    const { sections } = usePaperStore();
    const [formattedSections, setFormattedSections] = useState<{ title: string; content: string }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const processContent = async () => {
            if (sections.length === 0) {
                setFormattedSections([]);
                return;
            }

            setIsProcessing(true);
            const formatted = [];

            for (const section of sections) {
                if (!section.content.trim()) {
                    formatted.push({ title: section.title, content: '' });
                    continue;
                }

                const prompt = `You are a scientist writing a research paper. Convert the following bullet points into a concise scientific paragraph.

CRITICAL RULES:
- Use ONLY the information provided below - do not add extra details or expand beyond what's given
- Keep the paragraph concise and to the point
- Convert bullet points to flowing sentences, but stay brief
- Use formal academic tone
- For math expressions, use LaTeX: $E = mc^2$ or $$\\int_0^\\infty$$
- Return ONLY the paragraph, no extra text

Data:
${section.content}

Scientific paragraph:`;

                try {
                    const response = await fetch(OLLAMA_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: MODEL_NAME,
                            prompt: prompt,
                            stream: false,
                        }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        formatted.push({ title: section.title, content: data.response });
                    } else {
                        formatted.push({ title: section.title, content: section.content });
                    }
                } catch (error) {
                    console.error('Error formatting section:', error);
                    formatted.push({ title: section.title, content: section.content });
                }
            }

            setFormattedSections(formatted);
            setIsProcessing(false);
        };

        // Debounce the processing
        const timer = setTimeout(() => {
            processContent();
        }, 2000);

        return () => clearTimeout(timer);
    }, [sections]);

    return (
        <div className="flex-1 flex flex-col h-full border-l border-slate-200">
            <div className="p-6 border-b border-slate-100 bg-white/80 backdrop-blur-md flex justify-between items-center sticky top-0 z-10">
                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                        <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    Live Preview
                </h2>
                <div className="flex items-center gap-3">
                    {isProcessing ? (
                        <span className="text-xs font-medium text-amber-600 flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 animate-pulse">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Formatting...
                        </span>
                    ) : (
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-2 px-3 py-1.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            Ready
                        </span>
                    )}
                </div>
            </div>

            <div className="flex-1 bg-slate-100 p-8 overflow-hidden flex justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>
                <div className="w-full h-full shadow-2xl shadow-slate-200 rounded-lg overflow-hidden ring-1 ring-slate-200 z-10 bg-white">
                    <div className="w-full h-full overflow-y-auto p-12">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-3xl font-bold text-center mb-8 font-serif">Research Paper Preview</h1>

                            {sections.length === 0 ? (
                                <div className="text-center text-slate-400 py-20">
                                    <p>Add sections to see the preview</p>
                                </div>
                            ) : (
                                formattedSections.map((section, index) => (
                                    <div key={index} className="mb-8">
                                        <h2 className="text-2xl font-semibold mb-4 font-serif">{section.title || `Section ${index + 1}`}</h2>
                                        <div className="text-base leading-relaxed text-justify whitespace-pre-wrap font-serif text-slate-700">
                                            {section.content || (
                                                <span className="text-slate-400 italic">
                                                    {isProcessing ? 'Formatting...' : 'No content yet...'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
