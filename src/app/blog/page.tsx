import Link from 'next/link';
import BlogListItem from '@/components/BlogListItem';
import Sidebar from '@/components/Sidebar';
import Breadcrumb from '@/components/Breadcrumb';
import { getPosts, getRecentPosts } from '@/lib/blog';

export const metadata = {
    title: 'Blog - Tüm Yazılar',
    description: 'E-ticaret, SEO ve dijital pazarlama hakkında yazılar',
};

export default async function BlogPage({
    searchParams,
}: {
    searchParams: { page?: string };
}) {
    const page = Number(searchParams.page) || 1;
    const limit = 10; // Show 10 posts per page to match sidebar height

    // Fetch posts with pagination
    const { posts, totalPages, totalPosts } = await getPosts({
        page,
        limit,
        // No category filter here, this is the "All Posts" page
    });

    // Fetch recent posts for sidebar
    const recentPostsForSidebar = await getRecentPosts(5);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-blue-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="mb-4">
                        <Breadcrumb items={[
                            { label: 'Ana Sayfa', href: '/' },
                            { label: 'Blog', href: '/blog' },
                        ]} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Blog
                    </h1>
                    <p className="text-blue-200">
                        E-ticaret, SEO ve dijital pazarlama hakkında en güncel {totalPosts} içerik
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">

                        {/* Posts List */}
                        <div className="flex flex-col gap-6">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <BlogListItem key={post.slug} post={post} />
                                ))
                            ) : (
                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                    <p className="text-gray-600 text-lg mb-4">
                                        Henüz yazı bulunmamaktadır.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                {/* Previous Page */}
                                {page > 1 && (
                                    <Link
                                        href={`/blog?page=${page - 1}`}
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
                                            href={`/blog?page=${p}`}
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
                                        href={`/blog?page=${page + 1}`}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                                    >
                                        Sonraki &rarr;
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar recentPosts={recentPostsForSidebar} />
                    </div>
                </div>
            </div>
        </div>
    );
}
