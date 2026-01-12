
import markdownToHtml from './src/lib/markdownToHtml';
import { addHeadingIds } from './src/lib/addHeadingIds';

async function main() {
    const markdown = `
# Main Title

## Section 1
Content 1

### Subsection 1.1
Content 1.1

## Section 2
Content 2
`;

    console.log('--- Original Markdown ---');
    console.log(markdown);

    const html = await markdownToHtml(markdown);
    console.log('--- Generated HTML ---');
    console.log(html);

    const { html: htmlWithIds, toc } = addHeadingIds(html);
    console.log('--- HTML with IDs ---');
    console.log(htmlWithIds);
    console.log('--- ToC JSON ---');
    console.log(JSON.stringify(toc, null, 2));
}

main().catch(console.error);
