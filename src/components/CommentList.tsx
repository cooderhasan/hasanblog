import React from 'react';

interface Comment {
    id: string;
    name: string;
    content: string;
    createdAt: Date;
    adminReply?: string | null;
    adminReplyDate?: Date | null;
}

interface CommentListProps {
    comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
    if (comments.length === 0) {
        return (
            <div className="text-gray-500 italic text-center py-8 bg-gray-50 rounded-lg">
                Henüz yorum yapılmamış. İlk yorumu siz yapın!
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Yorumlar ({comments.length})
            </h3>
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-6 rounded-lg">
                        {/* User Comment */}
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h4 className="font-bold text-gray-900">{comment.name}</h4>
                                <span className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {comment.content}
                        </p>

                        {/* Admin Reply */}
                        {comment.adminReply && (
                            <div className="mt-4 ml-4 pl-4 border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="font-bold text-blue-900 text-sm">Yönetici Yanıtı</span>
                                    {comment.adminReplyDate && (
                                        <span className="text-xs text-blue-600">
                                            · {new Date(comment.adminReplyDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    )}
                                </div>
                                <p className="text-blue-900 leading-relaxed whitespace-pre-wrap">
                                    {comment.adminReply}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
