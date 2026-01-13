'use client';

import { useState } from 'react';
import { replyToComment } from '@/app/actions';
import toast from 'react-hot-toast';

interface ReplyFormProps {
    commentId: string;
    existingReply?: string | null;
}

export default function ReplyForm({ commentId, existingReply }: ReplyFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [reply, setReply] = useState(existingReply || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!reply.trim()) {
            toast.error('Yanıt boş olamaz');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await replyToComment(commentId, reply);
            if (result.success) {
                toast.success('Yanıt başarıyla kaydedildi');
                setIsOpen(false);
            } else {
                toast.error(result.error || 'Bir hata oluştu');
            }
        } catch (error) {
            console.error('Reply error:', error);
            toast.error('Beklenmedik bir hata oluştu');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
                {existingReply ? '✏️ Yanıtı Düzenle' : '💬 Yanıtla'}
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-3 space-y-2">
            <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                rows={3}
                placeholder="Yanıtınızı yazın..."
                required
            />
            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                    İptal
                </button>
            </div>
        </form>
    );
}
