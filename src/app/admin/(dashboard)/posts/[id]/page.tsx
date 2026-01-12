import prisma from '@/lib/prisma';
import PostForm from '@/components/admin/PostForm';
import { notFound } from 'next/navigation';

interface EditPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const { id } = await params;

    const [categories, post] = await Promise.all([
        prisma.category.findMany(),
        prisma.post.findUnique({ where: { id } }),
    ]);

    if (!post) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Yazıyı Düzenle</h1>
            <PostForm categories={categories} post={post} />
        </div>
    );
}
