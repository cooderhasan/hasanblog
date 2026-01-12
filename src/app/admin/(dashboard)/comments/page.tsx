import { approveComment, deleteComment } from '@/app/actions';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export default async function CommentsPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
    const { type } = await searchParams; // 'pending' or 'all'

    // Default to 'pending' to focus on moderation
    const filter = type === 'all' ? {} : { approved: false };

    const comments = await prisma.comment.findMany({
        where: filter,
        include: {
            post: {
                select: { title: true, slug: true }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Yorumlar</h1>
                <div className="flex gap-2">
                    <a
                        href="/admin/comments"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type !== 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Onay Bekleyenler
                    </a>
                    <a
                        href="/admin/comments?type=all"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    >
                        Tümü
                    </a>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">Yazar</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Yorum</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Yazı</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Durum</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Tarih</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {comments.map((comment) => (
                                <tr key={comment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 align-top">
                                        <div className="font-bold text-gray-900">{comment.name}</div>
                                        <div className="text-xs text-gray-500">{comment.email}</div>
                                    </td>
                                    <td className="px-6 py-4 align-top max-w-sm">
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <a href={`/blog/${comment.post.slug}`} target="_blank" className="text-blue-600 hover:underline text-sm block max-w-xs truncate">
                                            {comment.post.title}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        {comment.approved ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Onaylı
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Bekliyor
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 align-top text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(comment.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-4 align-top text-right">
                                        <div className="flex flex-col gap-2 items-end">
                                            {!comment.approved && (
                                                <form action={async () => {
                                                    'use server';
                                                    await approveComment(comment.id);
                                                }}>
                                                    <button className="text-green-600 hover:text-green-800 font-medium text-sm">
                                                        ✓ Onayla
                                                    </button>
                                                </form>
                                            )}
                                            <form action={async () => {
                                                'use server';
                                                await deleteComment(comment.id);
                                            }}>
                                                <button className="text-red-500 hover:text-red-700 font-medium text-sm">
                                                    🗑 Sil
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {comments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        {Object.keys(filter).length > 0 ? 'Onay bekleyen yorum yok.' : 'Henüz hiç yorum yok.'}
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
