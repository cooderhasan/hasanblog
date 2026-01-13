'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

interface HeaderProps {
    logoUrl?: string | null;
}

export default function Header({ logoUrl }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white border-b-2 border-green-500 relative">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

                    {/* Logo Area */}
                    <div className="flex items-center justify-between w-full lg:w-auto">
                        <Link href="/" className="flex flex-col z-20">
                            {logoUrl ? (
                                <div className="relative h-12 w-48">
                                    <Image
                                        src={logoUrl}
                                        alt="Hasan Durmuş"
                                        fill
                                        className="object-contain object-left"
                                        priority
                                        unoptimized={logoUrl.startsWith('/uploads/')}
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl font-bold text-gray-900 leading-none">
                                        <span className="text-black">Hasan</span> <span className="text-green-600">Durmuş</span>
                                    </h1>
                                    <span className="text-xs text-gray-500 tracking-wider">E-ticaret Uzmanı</span>
                                </>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 text-gray-700 z-20"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Menüyü Aç/Kapa"
                        >
                            {isMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Desktop Menu */}
                    <ul className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-gray-700">
                        <li>
                            <Link href="/" className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 transition-colors">
                                Ana Sayfa
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog/kategori/e-ticaret" className="hover:text-green-600 transition-colors">
                                E-ticaret
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog/kategori/pazaryerleri" className="hover:text-green-600 transition-colors flex items-center gap-1">
                                Pazaryerleri
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </Link>
                        </li>
                        <li>
                            <Link href="/hizmetler" className="hover:text-green-600 transition-colors flex items-center gap-1">
                                Hizmetler
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </Link>
                        </li>
                        <li>
                            <Link href="/hakkimda" className="hover:text-green-600 transition-colors">
                                Hakkımda
                            </Link>
                        </li>
                        <li>
                            <Link href="/iletisim" className="hover:text-green-600 transition-colors">
                                İletişim
                            </Link>
                        </li>
                    </ul>

                    {/* Search Bar */}
                    <div className="hidden lg:block w-64">
                        <form action="/blog" className="flex shadow-sm rounded-md overflow-hidden border border-gray-300">
                            <input
                                type="search"
                                name="q"
                                placeholder="Ara"
                                className="w-full px-3 py-1.5 text-sm focus:outline-none text-gray-700"
                            />
                            <button type="submit" className="bg-blue-500 text-white px-3 hover:bg-blue-600 transition-colors flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="fixed inset-0 bg-white z-50 pt-24 px-4 lg:hidden">
                        <div className="absolute top-4 right-4">
                            <button
                                className="p-2 text-gray-700"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <ul className="flex flex-col gap-6 text-center text-lg font-medium">
                            <li>
                                <Link href="/" className="text-green-600" onClick={() => setIsMenuOpen(false)}>Ana Sayfa</Link>
                            </li>
                            <li>
                                <Link href="/blog/kategori/e-ticaret" className="text-gray-700" onClick={() => setIsMenuOpen(false)}>E-ticaret</Link>
                            </li>
                            <li>
                                <Link href="/hizmetler" className="text-gray-700" onClick={() => setIsMenuOpen(false)}>Hizmetler</Link>
                            </li>
                            <li>
                                <Link href="/iletisim" className="text-gray-700" onClick={() => setIsMenuOpen(false)}>İletişim</Link>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <form action="/blog" className="flex shadow-sm rounded-md overflow-hidden border border-gray-300">
                                <input
                                    type="search"
                                    name="q"
                                    placeholder="Site içi arama yapın..."
                                    className="w-full px-4 py-3 text-base focus:outline-none"
                                />
                                <button type="submit" className="bg-green-600 text-white px-6">
                                    Ara
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
