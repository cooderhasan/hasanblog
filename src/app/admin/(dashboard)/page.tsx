import { auth } from '@/auth';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminDashboard() {
    const session = await auth();

    // Fetch stats
    const [postCount, categoryCount, recentPosts] = await Promise.all([
        prisma.post.count(),
        prisma.category.count(),
        prisma.post.findMany({
            orderBy: { date: 'desc' },
            take: 5,
            include: { category: true },
        }),
    ]);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Hoş geldiniz, {session?.user?.name || 'Admin'}!</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Total Posts */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Toplam Yazı</p>
                            <p className="text-2xl font-bold text-gray-900">{postCount}</p>
                        </div>
                    </div>
                </div>

                {/* Total Categories */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Kategoriler</p>
                            <p className="text-2xl font-bold text-gray-900">{categoryCount}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Action */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
                    <p className="text-sm opacity-80 mb-2">Hızlı Eylem</p>
                    <Link
                        href="/admin/posts/new"
                        className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Yazı Ekle
                    </Link>
                </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Son Yazılar</h2>
                </div>
                <div className="divide-y divide-gray-100">
                    {recentPosts.map((post) => (
                        <div key={post.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                            <div>
                                <h3 className="font-medium text-gray-900">{post.title}</h3>
                                <p className="text-sm text-gray-500">
                                    {post.category?.name} • {new Date(post.date).toLocaleDateString('tr-TR')}
                                </p>
                            </div>
                            <Link
                                href={`/admin/posts/${post.id}/edit`}
                                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                                Düzenle
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-100">
                    <Link
                        href="/admin/posts"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Tüm yazıları gör →
                    </Link>
                </div>
            </div>
        </div>
    );
}
