
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const slug = 'eticaret-seo-rehberi';
    const post = await prisma.post.findUnique({
        where: { slug },
    });

    if (!post) {
        console.log('Post not found!');
        return;
    }

    console.log('--- Post Title ---');
    console.log(post.title);
    console.log('--- Post Content Sample (First 500 chars) ---');
    console.log(post.content.substring(0, 500));
    console.log('--- Checking for Headers ---');
    const hasH2 = post.content.includes('## ');
    const hasH3 = post.content.includes('### ');
    console.log(`Has H2 (## ): ${hasH2}`);
    console.log(`Has H3 (### ): ${hasH3}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
