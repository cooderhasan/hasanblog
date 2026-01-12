import prisma from './prisma';
import { BlogPost } from '@/types/blog';
import readingTime from 'reading-time';

// Helper to convert DB Post to BlogPost type
const convertPostToBlogType = (post: any): BlogPost => {
    return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        date: post.date.toISOString(),
        excerpt: post.excerpt || '',
        category: post.category?.name || 'Genel',
        image: post.image || null,
        author: post.author?.name || 'Hasan Durmuş',
        content: post.content,
        readingTime: readingTime(post.content).text,
    };
};

export async function getAllPosts(): Promise<BlogPost[]> {
    const posts = await prisma.post.findMany({
        orderBy: { date: 'desc' },
        include: { category: true, author: true },
    });
    return posts.map(convertPostToBlogType);
}

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

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
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
}

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

export async function getRecentPosts(limit: number = 6): Promise<BlogPost[]> {
    const posts = await prisma.post.findMany({
        orderBy: { date: 'desc' },
        take: limit,
        include: { category: true, author: true },
    });
    console.log('getRecentPosts fetched:', posts.length);
    return posts.map(convertPostToBlogType);
}
