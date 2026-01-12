import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkImages() {
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            image: true,
        },
    });

    console.log('Posts with old image paths (hasan-blog):');
    posts.forEach(post => {
        if (post.image && post.image.includes('hasan-blog')) {
            console.log(`- ${post.title}: ${post.image}`);
        }
    });

    await prisma.$disconnect();
}

checkImages();
