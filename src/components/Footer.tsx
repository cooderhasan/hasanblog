import Link from 'next/link';
import Image from 'next/image';
import { getPostsByCategory, getRecentPosts } from '@/lib/blog';
import { BlogPost } from '@/types/blog';

export default async function Footer({ layoutWidth = 'max-w-6xl' }: { layoutWidth?: string }) {
    const currentYear = new Date().getFullYear();

    // Fetch data for columns
    const eTicaretPosts = (await getPostsByCategory('E-ticaret')).slice(0, 3);
    const pazarYeriPosts = (await getPostsByCategory('Pazaryerleri')).slice(0, 3);
    // Combine SEO and Social Media or just take recent for the 3rd column to ensure content
    const trendPosts = (await getRecentPosts(10)).filter(p => p.category !== 'E-ticaret' && p.category !== 'Pazaryerleri').slice(0, 3);

    const renderColumn = (title: string, posts: BlogPost[]) => (
        <div className="flex flex-col gap-4">
            <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-2 border-b border-gray-800 pb-2">
                {title}
            </h3>
            {posts.length > 0 ? (
                <>
                    {/* First Post - Featured Style */}
                    <Link href={`/blog/${posts[0].slug}`} className="group relative h-40 w-full rounded-lg overflow-hidden block mb-2">
                        {posts[0].image ? (
                            <Image
                                src={posts[0].image}
                                alt={posts[0].title}
                                fill
                                unoptimized={posts[0].image.startsWith('/uploads/')}
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-800" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-4">
                            <h4 className="text-white text-sm font-bold leading-tight line-clamp-2 group-hover:text-green-400 transition-colors">
                                {posts[0].title}
                            </h4>
                        </div>
                    </Link>

                    {/* Other Posts - List Style */}
                    <div className="flex flex-col gap-3">
                        {posts.slice(1).map((post, idx) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="flex gap-3 group items-start">
                                <div className="shrink-0 w-5 h-5 flex items-center justify-center bg-green-600 text-white text-xs font-bold rounded">
                                    {idx + 1}
                                </div>
                                <h4 className="text-gray-400 text-sm leading-snug group-hover:text-white transition-colors line-clamp-2">
                                    {post.title}
                                </h4>
                            </Link>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-gray-600 text-sm">İçerik hazırlanıyor...</p>
            )}
        </div>
    );

    return (
        <footer className="bg-[#111] text-gray-300">
            {/* Top Section - Featured Categories */}
            <div className="border-b border-gray-800">
                <div className={`${layoutWidth} mx-auto px-4 py-12`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {renderColumn('E-TİCARET', eTicaretPosts)}
                        {renderColumn('PAZARYERLERİ', pazarYeriPosts)}
                        {renderColumn('DİĞER KONULAR', trendPosts)}
                    </div>
                </div>
            </div>

            {/* Bottom Section - Navigation & Copyright */}
            <div className="bg-black py-6">
                <div className={`${layoutWidth} mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4`}>

                    {/* Bottom Nav */}
                    <nav>
                        <ul className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            <li><Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">E-Ticaret</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Pazaryerleri</Link></li>
                            <li><Link href="/hizmetler" className="hover:text-white transition-colors">Hizmetler</Link></li>
                            <li><Link href="/hakkimda" className="hover:text-white transition-colors">Hakkımda</Link></li>
                            <li><Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link></li>
                            <li><Link href="/gizlilik" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link href="/sitemap" className="hover:text-white transition-colors">Site Haritası</Link></li>
                        </ul>
                    </nav>

                    {/* Scroll / Copyright */}
                    <div className="flex items-center gap-4">
                        <p className="text-xs text-gray-600">
                            &copy; {currentYear} Hasan Durmuş
                        </p>
                        <a
                            href="#"
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors block"
                            aria-label="Yukarı Çık"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
