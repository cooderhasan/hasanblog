import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Hasan DURMUŞ</h3>
                        <p className="text-sm leading-relaxed">
                            E-ticaret danışmanlığı, SEO ve dijital pazarlama konularında uzman.
                            E-ticaret işletmelerinin büyümesine yardımcı oluyorum.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Hızlı Linkler</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/blog" className="hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/hizmetler" className="hover:text-white transition-colors">
                                    Hizmetler
                                </Link>
                            </li>
                            <li>
                                <Link href="/hakkimda" className="hover:text-white transition-colors">
                                    Hakkımda
                                </Link>
                            </li>
                            <li>
                                <Link href="/iletisim" className="hover:text-white transition-colors">
                                    İletişim
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Kategoriler</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/blog?category=e-ticaret" className="hover:text-white transition-colors">
                                    E-ticaret
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog?category=pazaryerleri" className="hover:text-white transition-colors">
                                    Pazaryerleri
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog?category=seo" className="hover:text-white transition-colors">
                                    SEO
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; {currentYear} Hasan DURMUŞ. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </footer>
    );
}
