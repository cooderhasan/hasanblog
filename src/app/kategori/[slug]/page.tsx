import Link from 'next/link';
import { notFound } from 'next/navigation';
import BlogListItem from '@/components/BlogListItem';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';
import { getPosts, getRecentPosts } from '@/lib/blog';
import { PrismaClient } from '@prisma/client';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const slug = decodeURIComponent(params.slug);
    const prisma = new PrismaClient();
    const category = await prisma.category.findFirst({
        where: {
            OR: [
                { slug: { equals: slug, mode: 'insensitive' } },
                { name: { equals: slug, mode: 'insensitive' } }
            ]
        }
    });

    // Simple capitalization for title if category name not found directly (fallback)
    const title = category?.name || slug.charAt(0).toUpperCase() + slug.slice(1);

    return {
        title: `${title} Yazıları - Blog | Hasan Durmuş`,
        description: `${title} hakkında en güncel yazılar, rehberler ve ipuçları.`,
    };
}

import PageContainer from '@/components/PageContainer';

export default async function CategoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const slug = decodeURIComponent(resolvedParams.slug);
    const page = Number(resolvedSearchParams.page) || 1;

    const limit = 10;

    // Fetch posts with pagination
    const { posts, totalPages, totalPosts } = await getPosts({
        page,
        limit,
        categorySlug: slug
    });

    const prisma = new PrismaClient();
    const category = await prisma.category.findFirst({
        where: {
            OR: [
                { slug: { equals: slug, mode: 'insensitive' } },
                { name: { equals: slug, mode: 'insensitive' } }
            ]
        }
    });

    if (!category && posts.length === 0) {
        notFound();
    }

    const categoryName = category?.name || slug.toUpperCase();

    // Fetch recent posts for sidebar
    const recentPostsForSidebar = await getRecentPosts(5);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <PageContainer className="py-2">
                <Breadcrumb items={[
                    { label: 'Ana Sayfa', href: '/' },
                    { label: categoryName, href: `/kategori/${slug}` },
                ]} />
            </PageContainer>

            <PageContainer className="py-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white shadow-sm border border-gray-100 p-6 md:p-8">
                            {/* Posts List */}
                            <div className="flex flex-col gap-6">
                                {posts.length > 0 ? (
                                    posts.map((post) => (
                                        <BlogListItem key={post.slug} post={post} />
                                    ))
                                ) : (
                                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                        <p className="text-gray-600 text-lg mb-4">
                                            Bu kategoride henüz yazı bulunmamaktadır.
                                        </p>
                                        <Link href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                            Tüm yazılara dön
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center gap-2">
                                    {/* Previous Page */}
                                    {page > 1 && (
                                        <Link
                                            href={`/kategori/${slug}?page=${page - 1}`}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            &larr; Önceki
                                        </Link>
                                    )}

                                    {/* Page Numbers */}
                                    {[...Array(totalPages)].map((_, i) => {
                                        const p = i + 1;
                                        const isCurrent = p === page;
                                        return (
                                            <Link
                                                key={p}
                                                href={`/kategori/${slug}?page=${p}`}
                                                className={`px-4 py-2 border rounded-lg transition ${isCurrent
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {p}
                                            </Link>
                                        );
                                    })}

                                    {/* Next Page */}
                                    {page < totalPages && (
                                        <Link
                                            href={`/kategori/${slug}?page=${page + 1}`}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                        >
                                            Sonraki &rarr;
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar recentPosts={recentPostsForSidebar} />
                    </div>
                </div>
            </PageContainer>
        </div>
    );
}
