import type { Section } from '../store/usePaperStore';

const OLLAMA_API_URL = 'http://localhost:11434/api/generate';
const MODEL_NAME = 'phi3'; // User specified phi3

export const generatePaper = async (sections: Section[]): Promise<string> => {
    let fullText = '';

    for (const section of sections) {
        // Skip empty sections
        if (!section.content.trim()) continue;

        const prompt = `You are a scientist writing a research paper. Using the following data, give me proper paragraphs in formal scientific style.
    
    Section Title: ${section.title}
    
    Data/Bullet Points:
    ${section.content}
    
    Instructions:
    - Write in formal academic tone suitable for peer-reviewed journals
    - Convert bullet points into flowing paragraphs with proper transitions
    - Do NOT use bullet points in the output - write in complete paragraphs only
    - For ANY mathematical expressions or equations, use proper LaTeX syntax:
      * Inline math: $E = mc^2$
      * Display equations: $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$
      * Use LaTeX commands: \\alpha, \\beta, \\frac{a}{b}, \\sum, \\int, etc.
    - Integrate the following citations naturally if possible: ${section.citations.join(', ')}
    - Return ONLY the generated paragraph text for this section
    - Do not include the title or any conversational filler
    `;

        try {
            const response = await fetch(OLLAMA_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    prompt: prompt,
                    stream: false,
                }),
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json();
            const generatedText = data.response;

            fullText += `\\section{${section.title}}\n\n${generatedText}\n\n`;

        } catch (error) {
            console.error('Error generating section:', error);
            fullText += `\\section{${section.title}}\n\n(Error generating content: ${error})\n\n`;
        }
    }

    return fullText;
};

export const chatWithLLM = async (messages: { role: string; content: string }[]): Promise<string> => {
    try {
        const systemMessage = {
            role: 'system',
            content: `You are a scientist writing a research paper. Using the data provided by the user, give proper paragraphs in formal scientific style.

YOUR PRIMARY TASK:
When the user provides bullet points or informal notes, convert them into formal, well-structured scientific paper text.

WRITING STYLE REQUIREMENTS:
- Write in formal academic tone suitable for peer-reviewed journals
- Use third person and passive voice where appropriate
- Convert bullet points into flowing paragraphs with proper transitions
- Maintain scientific rigor and precision
- Use technical terminology correctly
- Structure content with clear topic sentences and supporting details
- Ensure logical flow between ideas
- Write complete, publication-ready paragraphs
- NEVER return bullet points - always return formatted paragraphs

MATHEMATICAL EXPRESSIONS (CRITICAL):
When providing mathematical expressions or equations, ALWAYS use proper LaTeX syntax:
- Inline math: $E = mc^2$, $\\alpha + \\beta = \\gamma$
- Display equations: $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$
- Use LaTeX commands: \\alpha, \\beta, \\gamma, \\frac{a}{b}, \\sum, \\int, \\sqrt{x}, \\partial, \\nabla, etc.

FORMATTING:
- The user's content will be rendered as a PDF with LaTeX support
- Proper LaTeX formatting is ESSENTIAL for all mathematical content
- Do not use plain text for equations or formulas
- Always return properly formatted paragraphs, never bullet points

Remember: You are a scientist writing a paper. Transform any informal data into polished scientific prose!`
        };

        const messagesWithSystem = [systemMessage, ...messages];

        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: messagesWithSystem,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.message.content;

    } catch (error) {
        console.error('Error in chat:', error);
        return "I'm sorry, I couldn't connect to the local LLM. Please ensure Ollama is running.";
    }
};
