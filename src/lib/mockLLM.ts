import type { Section } from '../store/usePaperStore';

export const generatePaper = async (sections: Section[]): Promise<string> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let fullText = '';

    for (const section of sections) {
        fullText += `\\section{${section.title}}\n\n`;

        // Mock transformation: Turn bullet points into "formal" paragraphs
        const lines = section.content.split('\n').filter(line => line.trim().length > 0);
        if (lines.length > 0) {
            fullText += `Here we discuss ${section.title.toLowerCase()}. `;
            lines.forEach(line => {
                const cleanLine = line.replace(/^-\s*/, '');
                fullText += `It is observed that ${cleanLine}. `;
            });

            if (section.citations.length > 0) {
                fullText += ` (See: ${section.citations.join(', ')}).`;
            }
            fullText += '\n\n';
        }
    }

    return fullText;
};
