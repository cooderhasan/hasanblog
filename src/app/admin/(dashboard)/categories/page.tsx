import prisma from '@/lib/prisma';
import Link from 'next/link';
import DeleteCategoryButton from '@/components/admin/DeleteCategoryButton';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
    // ... same query ...
    const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
        include: { _count: { select: { posts: true } } }
    });

    return (
        <div>
            {/* ... header ... */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Kategoriler</h1>
                <Link
                    href="/admin/categories/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Yeni Ekle
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-600">Kategori Adı</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Slug</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Yazı Sayısı</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                                <td className="px-6 py-4 text-gray-500">{category.slug}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {category._count.posts} Yazı
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={`/admin/categories/${category.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Düzenle
                                        </Link>
                                        <DeleteCategoryButton id={category.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    Henüz kategori oluşturulmamış.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
