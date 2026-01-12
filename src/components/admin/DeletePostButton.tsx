'use client';

import { deletePost } from '@/app/actions';
import { useTransition } from 'react';

export default function DeletePostButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm('Bu yazıyı silmek istediğinize emin misiniz?')) {
            startTransition(async () => {
                await deletePost(id);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
        >
            {isPending ? 'Siliniyor...' : 'Sil'}
        </button>
    );
}
