import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogMetadata } from '@/types/blog';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

// Get all blog posts
export function getAllPosts(): BlogPost[] {
    // Ensure directory exists
    if (!fs.existsSync(postsDirectory)) {
        return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
        .map((fileName) => {
            const slug = fileName.replace(/\.(mdx|md)$/, '');
            const fullPath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = matter(fileContents);
            const stats = readingTime(content);

            return {
                slug,
                title: data.title,
                date: data.date,
                excerpt: data.excerpt,
                category: data.category,
                image: data.image,
                author: data.author || 'Hasan DURMUŞ',
                content,
                readingTime: stats.text,
            } as BlogPost;
        });

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

// Get single blog post by slug
export function getPostBySlug(slug: string): BlogPost | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.mdx`);
        let fileContents: string;

        if (fs.existsSync(fullPath)) {
            fileContents = fs.readFileSync(fullPath, 'utf8');
        } else {
            // Try .md extension
            const mdPath = path.join(postsDirectory, `${slug}.md`);
            if (fs.existsSync(mdPath)) {
                fileContents = fs.readFileSync(mdPath, 'utf8');
            } else {
                return null;
            }
        }

        const { data, content } = matter(fileContents);
        const stats = readingTime(content);

        return {
            slug,
            title: data.title,
            date: data.date,
            excerpt: data.excerpt,
            category: data.category,
            image: data.image,
            author: data.author || 'Hasan DURMUŞ',
            content,
            readingTime: stats.text,
        };
    } catch (error) {
        console.error(`Error reading post ${slug}:`, error);
        return null;
    }
}

// Get posts by category
export function getPostsByCategory(category: string): BlogPost[] {
    const allPosts = getAllPosts();
    return allPosts.filter((post) => post.category.toLowerCase() === category.toLowerCase());
}

// Get all categories
export function getAllCategories(): string[] {
    const allPosts = getAllPosts();
    const categories = allPosts.map((post) => post.category);
    return Array.from(new Set(categories));
}

// Get recent posts
export function getRecentPosts(limit: number = 6): BlogPost[] {
    const allPosts = getAllPosts();
    return allPosts.slice(0, limit);
}
