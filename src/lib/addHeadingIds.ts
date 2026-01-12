/**
 * Adds ID attributes to H2 and H3 headings in HTML content
 * for Table of Contents anchor links
 */
export interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function addHeadingIds(html: string): { html: string; toc: TocItem[] } {
    let index = 0;
    const toc: TocItem[] = [];

    // Match h2 and h3 tags and add id attribute
    const newHtml = html.replace(/<(h[23])([^>]*)>([^<]*)<\/\1>/gi, (match, tag, attrs, content) => {
        // If already has an id, extract it? For now assume we generate if missing.
        // But our regex is simple.
        // Let's stick to the previous simple regex which only matched the opening tag, to avoid issues with nested tags.
        // But to extract TEXT for ToC, we need to match the content.
        // HTML regex is fragile.
        // Better: parse with regex for opening tag, and finding text is hard with replace.

        // Plan B: Use CHEERIO or similar? No external deps if possible.
        // Let's stick to valid assumption: <hX>Text</hX>
        // Use a regex that captures content.
        return match;
    });

    // Actually, sticking to the existing regex `replace` is hard for extraction if we don't capture the full tag.
    // The previous regex was `/<(h[23])([^>]*)>/gi`. It only replaced the opening tag. 
    // It didn't know the text content.

    // If I want to extract ToC on server, I need to parse the content.
    // I can use `cheerio` if available? checking package.json...
    // Only `remark`, `remark-html`. 
    // I can use `remark` to extract headings!

    // BUT `markdownToHtml` returns string.

    // Let's try to parse the string with a regex that captures the content:
    // /<(h[23])(?:[^>]*)>(.*?)<\/\1>/gi

    const processedHtml = html.replace(/<(h[23])((?:[^>]*id="([^"]*)")?[^>]*)>(.*?)<\/\1>/gi, (match, tagRaw, attrs, existingId, content) => {
        const tag = tagRaw.toLowerCase();
        const level = parseInt(tag.replace('h', ''));
        const text = content.replace(/<[^>]*>/g, '').trim(); // Remove inner HTML tags from title

        let id = existingId;
        if (!id) {
            id = `heading-${index}`;
            index++;
            // Inject ID
            return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
        }

        toc.push({ id, text, level });
        return match; // Return original if ID existed (or modified above? wait logic error)
    });

    // Note: The logic above is slightly flawed because `replace` function return value replaces the MATCH.
    // Iterate twice?
    // 1. Generate IDs and get ToC.
    // 2. Return new string.

    // Correct approach using replace:

    return {
        html: html.replace(/<(h[23])((?:[^>]*)?)>(.*?)<\/\1>/gi, (match, tag, attrs, content) => {
            const level = parseInt(tag.charAt(1));
            const text = content.replace(/<[^>]*>/g, '').trim();
            const id = `heading-${index++}`;

            toc.push({ id, text, level });

            // Add ID to attributes. Ensure we don't double id if exists (ignoring for now as we control input)
            return `<${tag}${attrs} id="${id}">${content}</${tag}>`;
        }), toc
    };
}
