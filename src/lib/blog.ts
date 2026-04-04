import prisma from './prisma';
import { BlogPost } from '@/types/blog';
import readingTime from 'reading-time';
import { cache } from 'react';

// Helper to fix image paths and content URLs on the fly
const fixImageData = (post: any) => {
    let image = post.image || null;
    let content = post.content || '';

    // Fix featured image path
    if (image && image.startsWith('/images/blog/')) {
        const filename = image.split('/').pop()?.split('.')[0] || '';
        // Note: For now we try to find it in the wp-imports folder logic if we had fs access, 
        // but here we just remap it to the most likely matching pattern if it's broken.
        // Given our earlier analysis, we know these maps to /uploads/wp-imports/
        // A more robust way is to just assume the filename exists in wp-imports.
        image = image.replace('/images/blog/', '/uploads/wp-imports/');
        // Extensions might differ (.jpg -> .webp), we handle this by just mapping the prefix.
        // But since we can't do readdir here easily without making it async, 
        // we'll rely on the fact that some files were already moved.
    }

    // Fix hardcoded URLs in content
    const wpUrlRegex = /https?:\/\/(?:blog\.)?hasandurmus\.com\/wp-content\/uploads\/\d{4}\/\d{2}\//g;
    content = content.replace(wpUrlRegex, '/uploads/wp-imports/');

    // Also fix any leftover /images/blog/ in the content
    content = content.replace(/\/images\/blog\//g, '/uploads/wp-imports/');

    return { image, content };
};

// Helper to convert DB Post to BlogPost type
const convertPostToBlogType = (post: any): BlogPost => {
    const { image, content } = fixImageData(post);
    return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        date: post.date.toISOString(),
        excerpt: post.excerpt || '',
        category: post.category?.name || 'Genel',
        categorySlug: post.category?.slug || 'genel',
        image: image,
        author: post.author?.name || 'Hasan Durmuş',
        content: content,
        readingTime: readingTime(content).text,
    };
};

export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
    const posts = await prisma.post.findMany({
        orderBy: { date: 'desc' },
        include: { category: true, author: true },
    });
    return posts.map(convertPostToBlogType);
});

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    console.log('getPostBySlug called with:', slug);
    if (!slug || slug === 'undefined') {
        console.warn('getPostBySlug received invalid slug:', slug);
        return null;
    }

    try {
        const post = await prisma.post.findUnique({
            where: { slug },
            include: { category: true, author: true },
        });

        if (!post) return null;
        return convertPostToBlogType(post);
    } catch (error) {
        console.error('getPostBySlug PRISMA ERROR:', error);
        return null;
    }
}

export const getPostsByCategory = cache(async (categorySlug: string): Promise<BlogPost[]> => {
    // Note: The previous logic filtered by category NAME, so we might need to adjust.
    // If input is slug 'e-ticaret', we find by category slug.
    // If input is name 'E-Ticaret' (which page.tsx was doing), we might need to change call sites or handle both.
    // For now, let's assume filtering by Category Name for backward compatibility or Slug?
    // The previous code `post.category.toLowerCase() === category.toLowerCase()` was fuzzy.

    // Let's try matching Name partially or Exact?
    // Better to query by connection if possible.

    // Let's first fetch category by likely slug or name match
    const posts = await prisma.post.findMany({
        where: {
            OR: [
                { category: { name: { equals: categorySlug, mode: 'insensitive' } } },
                { category: { slug: { equals: categorySlug, mode: 'insensitive' } } }
            ]
        },
        orderBy: { date: 'desc' },
        include: { category: true, author: true },
    });
    return posts.map(convertPostToBlogType);
});

export async function getAllCategories(): Promise<string[]> {
    const categories = await prisma.category.findMany({
        select: { name: true },
    });
    return categories.map(c => c.name);
}


interface GetPostsOptions {
    page?: number;
    limit?: number;
    categorySlug?: string;
}

interface GetPostsResult {
    posts: BlogPost[];
    totalPages: number;
    totalPosts: number;
}

export async function getPosts({ page = 1, limit = 10, categorySlug }: GetPostsOptions): Promise<GetPostsResult> {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (categorySlug) {
        where.OR = [
            { category: { name: { equals: categorySlug, mode: 'insensitive' } } },
            { category: { slug: { equals: categorySlug, mode: 'insensitive' } } }
        ];
    }

    const [posts, totalPosts] = await Promise.all([
        prisma.post.findMany({
            where,
            orderBy: { date: 'desc' },
            skip,
            take: limit,
            include: { category: true, author: true },
        }),
        prisma.post.count({ where })
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    return {
        posts: posts.map(convertPostToBlogType),
        totalPages,
        totalPosts
    };
}

export const getRecentPosts = cache(async (limit: number = 6): Promise<BlogPost[]> => {
    const posts = await prisma.post.findMany({
        orderBy: { date: 'desc' },
        take: limit,
        include: { category: true, author: true },
    });
    console.log('getRecentPosts fetched:', posts.length);
    return posts.map(convertPostToBlogType);
});
