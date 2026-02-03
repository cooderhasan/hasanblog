
import { Metadata } from 'next';
import Link from 'next/link';
import PageContainer from '@/components/PageContainer';
import Breadcrumb from '@/components/Breadcrumb';
import { PrismaClient } from '@prisma/client';
import { getRecentPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic'; // Ensure this page is always rendered dynamically

export const metadata: Metadata = {
    title: 'Site Haritası - Hasan Durmuş',
    description: 'Site haritası üzerinden tüm içeriklere kolayca ulaşabilirsiniz.',
};

export default async function SitemapPage() {
    const prisma = new PrismaClient();

    // Fetch Categories
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: { name: true, slug: true, _count: { select: { posts: true } } }
    });

    // Fetch Recent Posts (limit 100 to show comprehensive list)
    const recentPosts = await getRecentPosts(100);

    const staticPages = [
        { title: 'Ana Sayfa', url: '/' },
        { title: 'Hakkımda', url: '/hakkimda' },
        { title: 'Hizmetler', url: '/hizmetler' },
        { title: 'İletişim', url: '/iletisim' },
        { title: 'Gizlilik Politikası', url: '/gizlilik' },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <PageContainer className="py-2">
                <Breadcrumb items={[
                    { label: 'Ana Sayfa', href: '/' },
                    { label: 'Site Haritası', href: '/site-haritasi' },
                ]} />
            </PageContainer>

            <PageContainer className="py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Site Haritası</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Pages Column */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Sayfalar
                        </h2>
                        <ul className="space-y-3">
                            {staticPages.map((page) => (
                                <li key={page.url}>
                                    <Link href={page.url} className="text-gray-600 hover:text-blue-600 transition-colors block border-b border-gray-50 pb-2">
                                        {page.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories Column */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Blog Kategorileri
                        </h2>
                        <ul className="space-y-3">
                            {categories.map((cat) => (
                                <li key={cat.slug}>
                                    <Link href={`/kategori/${cat.slug}`} className="group flex justify-between items-center text-gray-600 hover:text-green-600 transition-colors border-b border-gray-50 pb-2">
                                        <span>{cat.name}</span>
                                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full group-hover:bg-green-50 group-hover:text-green-600">
                                            {cat._count.posts}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Post List Column */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                            Tüm Yazılar
                        </h2>
                        <ul className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                            {recentPosts.map((post) => (
                                <li key={post.slug}>
                                    <Link href={`/${post.slug}`} className="text-gray-600 hover:text-blue-600 transition-colors block border-b border-gray-50 pb-2 text-sm">
                                        {post.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </PageContainer>
        </div>
    );
}
