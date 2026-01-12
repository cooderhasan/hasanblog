import prisma from '@/lib/prisma';
import CategoryForm from '@/components/admin/CategoryForm';
import { notFound } from 'next/navigation';

interface EditCategoryPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params;

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
        notFound();
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Kategoriyi Düzenle</h1>
            <CategoryForm category={category} />
        </div>
    );
}
