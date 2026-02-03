
import Breadcrumb from '@/components/Breadcrumb';
import PageContainer from '@/components/PageContainer';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { addHeadingIds } from '@/lib/addHeadingIds';
import Sidebar from '@/components/Sidebar';
import { getRecentPosts } from '@/lib/blog';

export async function generateMetadata() {
    return {
        title: 'Hakkımda - Hasan Durmuş',
        description: 'E-ticaret ve dijital pazarlama deneyimlerim hakkında bilgi alın.',
    };
}

export default async function AboutPage() {
    // Fetch dynamic content from Admin > Pages > hakkimda
    const page = await prisma.page.findUnique({
        where: { slug: 'hakkimda' }
    });

    // Fetch sidebar data
    const recentPosts = await getRecentPosts(5);
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } });

    // Default stats if not managed dynamically yet
    const stats = [
        { label: 'Yıllık Tecrübe', value: '10+' },
        { label: 'Tamamlanan Proje', value: '50+' },
        { label: 'Mutlu Müşteri', value: '30+' },
        { label: 'E-ticaret Hacmi', value: '₺50M+' },
    ];

    // Fallback content if database page is empty/missing
    const contentHtml = page?.content
        ? addHeadingIds(page.content).html
        : '<p>İçerik hazırlanıyor...</p>';

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header / Breadcrumb */}
            <PageContainer className="py-2">
                <Breadcrumb items={[
                    { label: 'Ana Sayfa', href: '/' },
                    { label: 'Hakkımda', href: '/hakkimda' },
                ]} />
            </PageContainer>

            {/* Main Content Area */}
            <PageContainer className="py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                    {/* Left Column: Content + Stats */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Grid - Moved to top of content */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
                            {/* Render Dynamic HTML Content */}
                            <div
                                className="prose prose-lg max-w-none prose-blue prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
                                dangerouslySetInnerHTML={{ __html: contentHtml }}
                            />
                        </div>

                        {/* CTA Section */}
                        <div className="bg-blue-600 rounded-2xl p-8 text-center text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Bir Projeniz mi Var?</h3>
                                <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                                    E-ticaret veya dijital pazarlama süreçlerinizi birlikte iyileştirelim.
                                </p>
                                <Link href="/iletisim" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm">
                                    İletişime Geçin
                                </Link>
                            </div>
                            {/* Decorative background circles */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-1">
                        <Sidebar recentPosts={recentPosts} authorImage={settings?.sidebarAboutImage} />
                    </div>

                </div>
            </PageContainer>
        </div>
    );
}
