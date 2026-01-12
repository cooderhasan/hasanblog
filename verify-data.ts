
import prisma from './src/lib/prisma';

async function main() {
    console.log('Verifying data...');

    // Check Author
    let author = await prisma.author.findFirst();
    if (!author) {
        console.log('No author found. Creating default author...');
        author = await prisma.author.create({
            data: {
                name: 'Hasan Durmuş',
                bio: 'Admin',
            }
        });
        console.log('Author created:', author.id);
    } else {
        console.log('Author exists:', author.id);
    }

    // Check Category
    const categoryCount = await prisma.category.count();
    if (categoryCount === 0) {
        console.log('No categories found. Creating default category...');
        await prisma.category.create({
            data: {
                name: 'Genel',
                slug: 'genel',
            }
        });
        console.log('Category created.');
    } else {
        console.log('Categories exist:', categoryCount);
    }

    console.log('Verification complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
