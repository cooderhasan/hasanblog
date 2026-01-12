import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function checkAllImages() {
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            image: true,
        },
    });

    let output = 'All post images:\n\n';
    posts.forEach(post => {
        output += `"${post.title}":\n`;
        output += `  Image: ${post.image || 'NULL'}\n\n`;
    });

    fs.writeFileSync('image-check-result.txt', output);
    console.log('Results written to image-check-result.txt');
    console.log(output);

    await prisma.$disconnect();
}

checkAllImages();
