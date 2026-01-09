import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { getAllPosts, getAllCategories } from '@/lib/blog';

export const metadata = {
    title: 'Blog',
    description: 'E-ticaret, SEO ve dijital pazarlama hakkında yazılar',
};

export default function BlogPage({
    searchParams,
}: {
    searchParams: { category?: string };
}) {
    const allPosts = getAllPosts();
    const categories = getAllCategories();
    const selectedCategory = searchParams.category;

    // Filter by category if selected
    const filteredPosts = selectedCategory
        ? allPosts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase())
        : allPosts;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
                    <p className="text-xl text-blue-100">
                        E-ticaret, SEO ve dijital pazarlama hakkında en güncel içerikler
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Category Filter */}
                        <div className="mb-8">
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/blog"
                                    className={`px-4 py-2 rounded-full font-medium transition-colors ${!selectedCategory
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    Tümü ({allPosts.length})
                                </Link>
                                {categories.map((category) => {
                                    const count = allPosts.filter(
                                        (p) => p.category.toLowerCase() === category.toLowerCase()
                                    ).length;
                                    return (
                                        <Link
                                            key={category}
                                            href={`/blog?category=${category.toLowerCase()}`}
                                            className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory?.toLowerCase() === category.toLowerCase()
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {category} ({count})
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Posts Grid */}
                        {filteredPosts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredPosts.map((post) => (
                                    <BlogCard key={post.slug} post={post} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <p className="text-gray-600 text-lg mb-2">
                                    Bu kategoride henüz yazı bulunmamaktadır.
                                </p>
                                <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Tüm yazılara dön
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:w-80">
                        {/* Categories Widget */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Kategoriler</h3>
                            <ul className="space-y-2">
                                {categories.map((category) => {
                                    const count = allPosts.filter(
                                        (p) => p.category.toLowerCase() === category.toLowerCase()
                                    ).length;
                                    return (
                                        <li key={category}>
                                            <Link
                                                href={`/blog?category=${category.toLowerCase()}`}
                                                className="flex justify-between items-center text-gray-700 hover:text-blue-600 transition-colors"
                                            >
                                                <span>{category}</span>
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                                                    {count}
                                                </span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* About Widget */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Hakkımda</h3>
                            <p className="text-gray-700 mb-4">
                                E-ticaret uzmanı olarak 10+ yıllık deneyimimle işletmelerin online satışlarını artırmalarına yardımcı oluyorum.
                            </p>
                            <Link
                                href="/hakkimda"
                                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Daha Fazla
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
