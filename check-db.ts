
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    try {
        const postCount = await prisma.post.count();
        console.log('Total Post Count:', postCount);

        if (postCount > 0) {
            const posts = await prisma.post.findMany({
                select: { title: true, slug: true, published: true }
            });
            console.log('Posts:', JSON.stringify(posts, null, 2));
        } else {
            console.log('No posts found in database.');
        }
    } catch (error) {
        console.error('Error querying database:', error);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
