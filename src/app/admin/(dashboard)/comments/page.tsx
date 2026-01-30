import { approveComment, deleteComment } from '@/app/actions';
import prisma from '@/lib/prisma';
import ReplyForm from '@/components/admin/ReplyForm';

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

            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-white rounded-lg shadow p-6">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-gray-900">{comment.name}</h3>
                                    {comment.approved ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Onaylı
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Bekliyor
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">{comment.email}</div>
                            </div>
                            <div className="text-sm text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        {/* Post Link */}
                        <div className="text-sm text-gray-500 mb-3">
                            Yazı: <a href={`/${comment.post.slug}`} target="_blank" className="text-blue-600 hover:underline">{comment.post.title}</a>
                        </div>

                        {/* Comment Content */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                        </div>

                        {/* Admin Reply */}
                        {comment.adminReply && (
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-blue-800 font-bold text-sm">Admin Yanıtı</span>
                                    {comment.adminReplyDate && (
                                        <span className="text-xs text-blue-600">
                                            {new Date(comment.adminReplyDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <p className="text-blue-900 whitespace-pre-wrap">{comment.adminReply}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
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

                            <ReplyForm
                                commentId={comment.id}
                                existingReply={comment.adminReply}
                            />

                            <form action={async () => {
                                'use server';
                                await deleteComment(comment.id);
                            }}>
                                <button className="text-red-500 hover:text-red-700 font-medium text-sm">
                                    🗑 Sil
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
                        {Object.keys(filter).length > 0 ? 'Onay bekleyen yorum yok.' : 'Henüz hiç yorum yok.'}
                    </div>
                )}
            </div>
        </div>
    );
}
