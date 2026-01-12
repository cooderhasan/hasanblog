
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const slug = 'e-ihracat-faturasi-rehberi';
    console.log(`Fetching post with slug: ${slug}`);

    const post = await prisma.post.findUnique({
        where: { slug }
    });

    if (!post) {
        console.log('Post not found in DB');
        return;
    }

    console.log('Post found!');
    console.log('Title:', post.title);
    console.log('Content Type:', typeof post.content);
    console.log('Content Length:', post.content?.length);
    console.log('Content Start:', post.content?.substring(0, 100));
    console.log('Content End:', post.content?.substring(post.content.length - 100));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
