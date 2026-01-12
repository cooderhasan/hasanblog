'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false });

interface PageData {
    id: string;
    slug: string;
    title: string;
    content: string;
    metaTitle: string | null;
    metaDescription: string | null;
    isActive: boolean;
}

export default function EditPageClient({ initialPage }: { initialPage: PageData }) {
    const router = useRouter();
    const [page, setPage] = useState(initialPage);
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch(`/api/pages/${page.slug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(page),
            });

            if (res.ok) {
                toast.success('Sayfa başarıyla güncellendi!');
                router.push('/admin/pages');
            } else {
                toast.error('Güncelleme başarısız');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{page.title} Sayfasını Düzenle</h1>
                <p className="text-gray-600 mt-1">URL: /{page.slug}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
                {/* SEO Section */}
                <section className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        SEO Ayarları
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sayfa Başlığı</label>
                            <input
                                type="text"
                                value={page.title}
                                onChange={(e) => setPage({ ...page, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Title <span className="text-gray-400">(60 karakter önerilir)</span>
                            </label>
                            <input
                                type="text"
                                value={page.metaTitle || ''}
                                onChange={(e) => setPage({ ...page, metaTitle: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                maxLength={70}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Description <span className="text-gray-400">(160 karakter önerilir)</span>
                            </label>
                            <textarea
                                value={page.metaDescription || ''}
                                onChange={(e) => setPage({ ...page, metaDescription: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                maxLength={200}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={page.isActive}
                                onChange={(e) => setPage({ ...page, isActive: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                Sayfa Aktif
                            </label>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Sayfa İçeriği</h2>
                    <RichTextEditor
                        content={page.content}
                        onChange={(content) => setPage({ ...page, content })}
                        placeholder="Sayfa içeriğini buraya yazın..."
                    />
                </section>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
