'use client';

import { useState } from 'react';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';
import Image from 'next/image';

interface SidebarProps {
    recentPosts: BlogPost[];
}

type TabType = 'populer' | 'son-yazi' | 'yorumlar' | 'etiketler';

export default function Sidebar({ recentPosts }: SidebarProps) {
    const [activeTab, setActiveTab] = useState<TabType>('populer');

    // Filter posts for E-Ticaret category specifically
    const eTicaretPosts = recentPosts.filter(p => p.category === 'E-ticaret').slice(0, 5);

    // Mock Popular posts (reusing recent for now)
    const popularPosts = recentPosts.slice(0, 5);

    // Mock Most Commented posts
    const mostCommentedPosts = [...recentPosts].reverse().slice(0, 4);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'populer':
                return (
                    <div className="space-y-4">
                        {recentPosts.map((post) => (
                            <Link key={post.slug} href={`/${post.slug}`} className="flex gap-4 group">
                                <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden">
                                    {post.image ? (
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            unoptimized={post.image.startsWith('/uploads/')}
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <span className="text-2xl">📷</span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug">
                                        {post.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 mt-1 block">
                                        {new Date(post.date).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                );
            case 'son-yazi':
                return (
                    <div className="space-y-4">
                        {recentPosts.slice(0, 5).map((post) => (
                            <Link key={post.slug} href={`/${post.slug}`} className="flex gap-4 group items-start">
                                <div className="relative w-20 h-16 shrink-0 rounded overflow-hidden bg-gray-100">
                                    {post.image && (
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            unoptimized={post.image.startsWith('/uploads/')}
                                            className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
                                        {post.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 mt-1 block">
                                        {new Date(post.date).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                );
            case 'yorumlar':
                return <div className="text-sm text-gray-500 py-4 text-center">Henüz yorum bulunmamaktadır.</div>;
            case 'etiketler':
                return (
                    <div className="flex flex-wrap gap-2">
                        {['E-ticaret', 'SEO', 'Pazarlama', 'Sosyal Medya', 'Girişimcilik', 'Yazılım', 'Tasarım'].map(tag => (
                            <Link key={tag} href={`/?q=${tag}`} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded hover:bg-green-600 hover:text-white transition-colors">
                                {tag}
                            </Link>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <aside className="w-full space-y-8">
            {/* Search Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-green-600 pl-3">
                    Ara
                </h3>
                <form action="/" className="flex flex-col gap-2">
                    <input
                        type="search"
                        name="q"
                        placeholder="Sitede ara..."
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-green-600 text-sm"
                    />
                    <button type="submit" className="w-full bg-orange-500 text-white font-bold py-2 rounded hover:bg-orange-600 transition-colors">
                        Ara
                    </button>
                </form>
            </div>

            {/* About Me Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    {/* Placeholder for Profile Image - using a generic person SVG if no image is available, or user can upload one */}
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Hasan DURMUŞ</h3>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    1986 Konya doğumluyum. Halen Konya'da yaşamaya devam ediyorum. Anadolu Üniversitesi Kamu Yönetimi ve Ankara Üniversitesi Bilgisayar Programcılığından mezunum.
                </p>
                <Link href="/hakkimda" className="inline-block bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors mb-6">
                    Okumaya Devam Et
                </Link>

                <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Sosyal Medya</h4>
                    <div className="flex justify-center gap-4">
                        <a href="#" className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.894-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.466c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                        </a>
                        <a href="#" className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                        </a>
                        <a href="#" className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-colors">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Tabs Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex border-b border-gray-200 mb-4 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('populer')}
                        className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors shrink-0 px-2 ${activeTab === 'populer'
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <span className="block mb-1 text-lg">★</span>
                        POPÜLER
                    </button>
                    <button
                        onClick={() => setActiveTab('son-yazi')}
                        className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors shrink-0 px-2 ${activeTab === 'son-yazi'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <span className="block mb-1 text-lg">🕒</span>
                        SON YAZI
                    </button>
                    <button
                        onClick={() => setActiveTab('yorumlar')}
                        className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors shrink-0 px-2 ${activeTab === 'yorumlar'
                            ? 'border-orange-500 text-orange-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <span className="block mb-1 text-lg">💬</span>
                        YORUMLAR
                    </button>
                    <button
                        onClick={() => setActiveTab('etiketler')}
                        className={`flex-1 pb-2 text-xs font-bold uppercase tracking-wider text-center border-b-2 transition-colors shrink-0 px-2 ${activeTab === 'etiketler'
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <span className="block mb-1 text-lg">🏷️</span>
                        ETİKETLER
                    </button>
                </div>

                {renderTabContent()}
            </div>

            {/* Category Posts Widget (E-TİCARET) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-blue-600 pl-3 uppercase">
                    E-TİCARET
                </h3>
                <div className="space-y-4">
                    {eTicaretPosts.length > 0 ? (
                        eTicaretPosts.map((post) => (
                            <Link key={post.slug} href={`/${post.slug}`} className="flex gap-4 group items-start">
                                <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden bg-gray-100">
                                    {post.image && (
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-[#2DDE98] transition-colors">
                                        {post.title}
                                    </h4>
                                    <span className="text-xs text-gray-500 mt-1 block">
                                        {new Date(post.date).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">Bu kategoride henüz yazı yok.</p>
                    )}
                </div>
            </div>

            {/* Most Commented Widget (Mock) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-red-500 pl-3 uppercase">
                    ÇOK YORUMLANAN
                </h3>
                <div className="space-y-4">
                    {mostCommentedPosts.map((post, index) => (
                        <Link key={post.slug} href={`/${post.slug}`} className="flex gap-4 group items-center">
                            <div className="relative w-10 h-10 shrink-0 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                                {index + 1}
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-[#2DDE98] transition-colors">
                                    {post.title}
                                </h4>
                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                    <span className="text-xs">💬 {(index + 2) * 3} Yorum</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}
