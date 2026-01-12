import prisma from '@/lib/prisma';
import PostForm from '@/components/admin/PostForm';

export default async function NewPostPage() {
    const categories = await prisma.category.findMany();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Yeni Yazı Ekle</h1>
            <PostForm categories={categories} />
        </div>
    );
}
