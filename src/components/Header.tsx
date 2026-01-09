import Link from 'next/link';

export default function Header() {
    return (
        <header className="border-b border-gray-200 bg-white">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                        Hasan DURMUŞ
                    </Link>
                    <ul className="flex gap-8">
                        <li>
                            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                                Ana Sayfa
                            </Link>
                        </li>
                        <li>
                            <Link href="/blog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                                Blog
                            </Link>
                        </li>
                        <li>
                            <Link href="/hizmetler" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                                Hizmetler
                            </Link>
                        </li>
                        <li>
                            <Link href="/hakkimda" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                                Hakkımda
                            </Link>
                        </li>
                        <li>
                            <Link href="/iletisim" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                                İletişim
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
