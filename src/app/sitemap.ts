import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://hasandurmus.com'

    // Static routes
    const routes = [
        '',
        '/hakkimda',
        '/iletisim',
        '/hizmetler',
        '/site-haritasi',
        '/gizlilik-politikasi',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Blog posts
    const posts = await getAllPosts()
    const postRoutes = posts.map((post) => ({
        url: `${baseUrl}/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    // Categories
    const categories = await prisma.category.findMany()
    const categoryRoutes = categories.map((category) => ({
        url: `${baseUrl}/kategori/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    return [...routes, ...postRoutes, ...categoryRoutes]
}
