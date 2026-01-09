import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { getRecentPosts } from '@/lib/blog';

export default function Home() {
  const recentPosts = getRecentPosts(6);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              E-ticaret Uzmanı Hasan DURMUŞ
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              E-ticaret danışmanlığı, SEO ve dijital pazarlama ile işletmenizi büyütmeye hazır mısınız?
            </p>
            <div className="flex gap-4">
              <Link
                href="/blog"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Blog Yazılarım
              </Link>
              <Link
                href="/iletisim"
                className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors border-2 border-white"
              >
                İletişime Geç
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Son Blog Yazıları</h2>
            <Link
              href="/blog"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              Tüm Yazılar
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Henüz blog yazısı bulunmamaktadır.</p>
              <p className="text-gray-500 text-sm mt-2">Yakında içerikler eklenecektir.</p>
            </div>
          )}
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Hizmetlerim</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">E-ticaret Danışmanlığı</h3>
              <p className="text-gray-700 mb-4">
                E-ticaret işletmenizi büyütmek için stratejik danışmanlık hizmeti sunuyorum.
              </p>
              <Link href="/hizmetler" className="text-blue-600 font-medium hover:text-blue-700">
                Detaylı Bilgi →
              </Link>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">SEO ve Dijital Pazarlama</h3>
              <p className="text-gray-700 mb-4">
                Arama motorlarında üst sıralara çıkmanız için SEO ve pazarlama stratejileri.
              </p>
              <Link href="/hizmetler" className="text-green-600 font-medium hover:text-green-700">
                Detaylı Bilgi →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
