import CategoryForm from '@/components/admin/CategoryForm';

export default function NewCategoryPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Yeni Kategori Ekle</h1>
            <CategoryForm />
        </div>
    );
}
