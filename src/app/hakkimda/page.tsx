
import Breadcrumb from '@/components/Breadcrumb';
import PageContainer from '@/components/PageContainer';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { addHeadingIds } from '@/lib/addHeadingIds';

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

    // Sidebar Author Image URL
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } });
    const profileImage = settings?.sidebarAboutImage || null;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-gray-100">
                <PageContainer className="py-8">
                    <Breadcrumb items={[
                        { label: 'Ana Sayfa', href: '/' },
                        { label: 'Hakkımda', href: '/hakkimda' },
                    ]} />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-6">{page?.title || 'Hakkımda'}</h1>
                </PageContainer>
            </div>

            {/* Main Content Area */}
            <PageContainer className="py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                    {/* Left Column: Profile Card (Static/Dynamic Layout) */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden group">
                            {/* Background Decoration */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-blue-600"></div>

                            <div className="relative z-10 mt-12">
                                <div className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-200">
                                    {profileImage ? (
                                        <Image
                                            src={profileImage}
                                            alt="Hasan Durmuş"
                                            width={128}
                                            height={128}
                                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        </div>
                                    )}
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mt-4">Hasan Durmuş</h2>
                                <p className="text-blue-600 font-medium text-sm">E-ticaret & Dijital Pazarlama Uzmanı</p>

                                <div className="mt-6 flex justify-center gap-3">
                                    <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                                    </a>
                                    <a href="#" className="p-2 bg-gray-50 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                    </a>
                                    <a href="mailto:iletisim@hasandurmus.com" className="p-2 bg-gray-50 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                                    <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Dynamic Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
                            {/* Render Dynamic HTML Content */}
                            <div
                                className="prose prose-lg max-w-none prose-blue prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700"
                                dangerouslySetInnerHTML={{ __html: contentHtml }}
                            />
                        </div>

                        {/* CTA Section */}
                        <div className="mt-8 bg-blue-600 rounded-2xl p-8 text-center text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-4">Bir Projeniz mi Var?</h3>
                                <p className="text-blue-100 mb-6 max-w-xl mx-auto">
                                    E-ticaret veya dijital pazarlama süreçlerinizi birlikte iyileştirelim.
                                </p>
                                <a href="/iletisim" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm">
                                    İletişime Geçin
                                </a>
                            </div>
                            {/* Decorative background circles */}
                            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                        </div>
                    </div>

                </div>
            </PageContainer>
        </div>
    );
}
