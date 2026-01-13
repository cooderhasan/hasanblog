import markdownToHtml from './src/lib/markdownToHtml';

async function test() {
    const htmlInput = '<p>Hello <strong>World</strong></p><ul><li>Item 1</li></ul>';
    const output = await markdownToHtml(htmlInput);
    console.log('Input:', htmlInput);
    console.log('Output:', output);
    console.log('Match?', htmlInput.trim() === output.trim());
}

test().catch(console.error);
