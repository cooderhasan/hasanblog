
import fs from 'fs';
import path from 'path';
import prisma from './src/lib/prisma';

// Simple slug generator matching utils.ts logic
function generateSlug(title: string): string {
    const turkishChars: { [key: string]: string } = {
        'ğ': 'g', 'Ğ': 'g', 'ü': 'u', 'Ü': 'u', 'ş': 's', 'Ş': 's',
        'ı': 'i', 'İ': 'i', 'ö': 'o', 'Ö': 'o', 'ç': 'c', 'Ç': 'c',
    };
    let slug = title.toLowerCase();
    Object.keys(turkishChars).forEach(char => {
        slug = slug.replace(new RegExp(char, 'g'), turkishChars[char]);
    });
    return slug.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

async function main() {
    const contentDir = path.join(process.cwd(), 'src', 'content', 'blog');

    if (!fs.existsSync(contentDir)) {
        console.error('Content directory not found:', contentDir);
        process.exit(1);
    }

    const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));
    console.log(`Found ${files.length} MDX files.`);

    // Ensure default author
    let defaultAuthor = await prisma.author.findFirst({ where: { name: 'Hasan Durmuş' } });
    if (!defaultAuthor) {
        defaultAuthor = await prisma.author.create({
            data: { name: 'Hasan Durmuş', bio: 'Admin' }
        });
        console.log('Created default author: Hasan Durmuş');
    }

    for (const file of files) {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        // Extract frontmatter
        // Extract frontmatter with more robust regex for CRLF
        const match = fileContent.match(/^---\s+([\s\S]*?)\s+---\s+([\s\S]*)$/);
        if (!match) {
            console.warn(`Skipping ${file}: Invalid frontmatter format.`);
            continue;
        }

        const frontmatterRaw = match[1];
        const content = match[2].trim();
        const slug = file.replace('.mdx', '');

        // Parse frontmatter manually
        const metadata: any = {};
        frontmatterRaw.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                let value = parts.slice(1).join(':').trim();
                // Remove quotes
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                metadata[key] = value;
            }
        });

        if (!metadata.title) {
            console.warn(`Skipping ${file}: Missing title.`);
            continue;
        }

        console.log(`Processing: ${slug}`);

        // Handle Category
        let categoryId = null;
        if (metadata.category) {
            const catName = metadata.category;
            const catSlug = generateSlug(catName);

            const category = await prisma.category.upsert({
                where: { slug: catSlug },
                update: {},
                create: { name: catName, slug: catSlug }
            });
            categoryId = category.id;
        } else {
            // Default category 'Genel'
            const general = await prisma.category.upsert({
                where: { slug: 'genel' },
                update: {},
                create: { name: 'Genel', slug: 'genel' }
            });
            categoryId = general.id;
        }

        // Upsert Post
        await prisma.post.upsert({
            where: { slug },
            update: {
                title: metadata.title,
                content: content,
                excerpt: metadata.excerpt || '',
                image: metadata.image || '',
                categoryId: categoryId,
                date: metadata.date ? new Date(metadata.date) : new Date(),
                authorId: defaultAuthor.id // Using default author for now
            },
            create: {
                slug,
                title: metadata.title,
                content: content,
                excerpt: metadata.excerpt || '',
                image: metadata.image || '',
                categoryId: categoryId,
                date: metadata.date ? new Date(metadata.date) : new Date(),
                authorId: defaultAuthor.id,
                published: true
            }
        });
    }

    console.log('Sync complete.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
