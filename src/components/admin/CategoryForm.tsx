'use client';

import { createCategory, updateCategory } from '@/app/actions';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface CategoryFormProps {
    category?: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
    const action = async (formData: FormData) => {
        if (category) {
            await updateCategory(category.id, formData);
        } else {
            await createCategory(formData);
        }
    };

    return (
        <form action={action} className="bg-white p-6 rounded-lg shadow-sm space-y-6 max-w-md mx-auto">
            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Kategori Adı
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    defaultValue={category?.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                    İptal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                >
                    {category ? 'Güncelle' : 'Kaydet'}
                </button>
            </div>
        </form>
    );
}
