import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import PostForm from '@/components/admin/PostForm';

export default async function EditPostPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [post, categories] = await Promise.all([
        prisma.post.findUnique({
            where: { id },
            include: { category: true },
        }),
        prisma.category.findMany({
            orderBy: { name: 'asc' },
        }),
    ]);

    if (!post) {
        notFound();
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/posts"
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Yazıyı Düzenle</h1>
                    <p className="text-gray-600 mt-1">{post.title}</p>
                </div>
            </div>

            {/* Form */}
            <PostForm
                categories={categories}
                post={{
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    excerpt: post.excerpt || '',
                    content: post.content,
                    image: post.image || '',
                    categoryId: post.categoryId,
                    published: post.published,
                    focusKeyword: post.focusKeyword || '',
                }}
            />
        </div>
    );
}
