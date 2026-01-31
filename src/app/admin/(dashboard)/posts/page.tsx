import prisma from '@/lib/prisma';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import DeletePostButton from '@/components/admin/DeletePostButton';

import PostFilter from '@/components/admin/PostFilter';

export const dynamic = 'force-dynamic';

export default async function PostsPage(props: {
    searchParams?: Promise<{
        q?: string;
    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q || '';

    const posts = await prisma.post.findMany({
        where: {
            title: {
                contains: query,
                mode: 'insensitive',
            },
        },
        include: {
            category: true,
            author: true,
        },
        orderBy: {
            date: 'desc',
        },
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Yazılar</h1>
                <Link
                    href="/admin/posts/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Ekle
                </Link>
            </div>

            <PostFilter />

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">Resim</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Başlık</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Kategori</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Durum</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Tarih</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {post.image ? (
                                            <div className="w-16 h-10 relative rounded overflow-hidden">
                                                {/* Using img for simplicity in admin, or Image if domain configured */}
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{post.title}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {post.category?.name || 'Genel'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.published ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Yayında
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Taslak
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {(() => {
                                            try {
                                                const d = new Date(post.date);
                                                return isNaN(d.getTime()) ? '-' : format(d, 'd MMM yyyy', { locale: tr });
                                            } catch (e) {
                                                return '-';
                                            }
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <Link
                                                href={`/admin/posts/${post.id}`}
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Düzenle
                                            </Link>
                                            <DeletePostButton id={post.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        Henüz hiç yazı eklenmemiş.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
