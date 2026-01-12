import { formatDate } from '@/lib/utils';
import React from 'react';

interface Comment {
    id: string;
    name: string;
    content: string;
    createdAt: Date;
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
                    </div>
                ))}
            </div>
        </div>
    );
}
