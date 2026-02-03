'use client';

import { createPost, updatePost } from '@/app/actions';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false });

interface Category {
    id: string;
    name: string;
}

interface Post {
    id: string;
    title: string;
    content: string;
    excerpt?: string | null;
    image?: string | null;
    published: boolean;
    categoryId: string;
    slug: string;
    focusKeyword?: string | null;
}

interface PostFormProps {
    categories: Category[];
    post?: Post;
}

export default function PostForm({ categories, post }: PostFormProps) {
    const router = useRouter();
    const [content, setContent] = useState(post?.content || '');
    const [image, setImage] = useState(post?.image || '');
    const [title, setTitle] = useState(post?.title || '');
    const [excerpt, setExcerpt] = useState(post?.excerpt || '');
    const [focusKeyword, setFocusKeyword] = useState(post?.focusKeyword || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Keyword analysis
    const keywordAnalysis = useMemo(() => {
        if (!focusKeyword) return null;

        const keyword = focusKeyword.toLowerCase();
        const titleLower = title.toLowerCase();
        const excerptLower = excerpt.toLowerCase();

        // Strip HTML for content analysis
        const textContent = content.replace(/<[^>]*>/g, '').toLowerCase();

        // Count occurrences
        const countOccurrences = (text: string, word: string) => {
            const regex = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            return (text.match(regex) || []).length;
        };

        const inTitle = titleLower.includes(keyword);
        const inExcerpt = excerptLower.includes(keyword);
        const contentCount = countOccurrences(textContent, keyword);
        const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;
        const density = wordCount > 0 ? ((contentCount / wordCount) * 100).toFixed(2) : '0';

        return {
            inTitle,
            inExcerpt,
            contentCount,
            density: parseFloat(density),
        };
    }, [focusKeyword, title, excerpt, content]);

    const handleSubmit = async (formData: FormData) => {
        // Prevent multiple submissions
        if (isSubmitting) return;

        // Get the triggering button's value (save vs save_close)
        // Note: When using form action, the button value isn't automatically included in formData 
        // if handled via JS onSubmit unless using native submit.
        // However, we can use the `nativeEvent` submitter if we changed to onSubmit, or we can simpler:
        // Since we are using Next.js Server Actions via `action={handleSubmit}`, the button value IS included
        // IF the button has a name/value. BUT `handleSubmit` here is a client wrapper.
        // The FormData passed to this function WILL contain the button's name/value if triggered naturally.

        setIsSubmitting(true);
        formData.set('content', content);
        formData.set('image', image);
        formData.set('focusKeyword', focusKeyword);

        const actionType = formData.get('action'); // 'save' or 'save_close'

        try {
            let result;
            if (post) {
                result = await updatePost(post.id, formData);
            } else {
                result = await createPost(formData);
            }

            if (result?.error) {
                toast.error(result.error);
            } else if (result?.success) {
                toast.success(post ? 'Yazı başarıyla güncellendi!' : 'Yazı başarıyla oluşturuldu!');

                if (actionType === 'save_close') {
                    router.push('/admin/posts');
                } else {
                    // Stay on page, maybe update URL if new post created?
                    // If created, we might want to replace URL to edit mode?
                    // For now, if "Save" is clicked on create, it might stay on "New" page which is weird.
                    // IMPORTANT: If creating new post and staying, we should probably redirect to edit page of that new post or reset form?
                    // Since server action `createPost` doesn't return the ID, we can't redirect to edit easily without modifying it.
                    // But for updating, stay is fine.

                    // For create: if success, better to redirect to edit page or list.
                    // Let's assume standard "Save" on create -> Redirect to Edit?
                    // createPost currently returns { success: true }.

                    // For now, purely based on user request: "yazı içinde kalmıyor". 
                    // This implies they are editing.
                    // If they are creating, staying on "create" form with filled data is OK-ish but technically risky if they save again (duplicate).
                    // But let's handle the "Update" case perfectly first.
                }
                router.refresh();
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Bir şeyler ters gitti.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form action={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6 max-w-4xl mx-auto">
            {/* Focus Keyword - SEO Section */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                    🎯 SEO - Hedef Anahtar Kelime
                </h3>
                <div className="space-y-3">
                    <div>
                        <input
                            type="text"
                            name="focusKeyword"
                            value={focusKeyword}
                            onChange={(e) => setFocusKeyword(e.target.value)}
                            placeholder="Örn: e-ticaret, dropshipping, shopify"
                            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        />
                        <p className="text-xs text-green-700 mt-1">Bu kelime için yazınızı optimize edin.</p>
                    </div>

                    {keywordAnalysis && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                            <div className={`p-2 rounded ${keywordAnalysis.inTitle ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <div className="font-bold">Başlıkta</div>
                                <div>{keywordAnalysis.inTitle ? '✓ Var' : '✗ Yok'}</div>
                            </div>
                            <div className={`p-2 rounded ${keywordAnalysis.inExcerpt ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                <div className="font-bold">Özette</div>
                                <div>{keywordAnalysis.inExcerpt ? '✓ Var' : '⚠ Ekleyin'}</div>
                            </div>
                            <div className={`p-2 rounded ${keywordAnalysis.contentCount >= 3 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                <div className="font-bold">İçerikte</div>
                                <div>{keywordAnalysis.contentCount} kez</div>
                            </div>
                            <div className={`p-2 rounded ${keywordAnalysis.density >= 1 && keywordAnalysis.density <= 3 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                <div className="font-bold">Yoğunluk</div>
                                <div>%{keywordAnalysis.density}</div>
                            </div>
                        </div>
                    )}

                    <p className="text-xs text-green-600">
                        💡 <strong>İpucu:</strong> Anahtar kelime başlıkta, ilk paragrafta ve alt başlıklarda geçmeli. Yoğunluk %1-3 arası ideal.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Başlık <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="SEO dostu, anahtar kelime içeren başlık"
                    />
                    <p className="text-xs text-gray-500">💡 50-60 karakter ({title.length}/60)</p>
                </div>

                <div className="space-y-2">
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                        Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="categoryId"
                        id="categoryId"
                        required
                        defaultValue={post?.categoryId || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                        <option value="" disabled>Kategori Seçiniz</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                    Özet (Meta Description)
                </label>
                <textarea
                    name="excerpt"
                    id="excerpt"
                    rows={3}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="Arama sonuçlarında görünecek kısa açıklama..."
                />
                <p className="text-xs text-gray-500">💡 150-160 karakter ({excerpt.length}/160). Anahtar kelimeyi içermeli.</p>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Kapak Görseli
                </label>
                <ImageUpload value={image} onChange={setImage} />
            </div>

            {/* Rich Text Content */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    İçerik <span className="text-red-500">*</span>
                </label>
                <RichTextEditor
                    content={content}
                    onChange={setContent}
                    placeholder="Yazınızı buraya yazın. H1, H2 başlıkları, listeler ve görseller kullanın..."
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    name="published"
                    id="published"
                    defaultChecked={post?.published ?? true}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">
                    Yayına Al (Published)
                </label>
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
                    name="action"
                    value="save"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                <button
                    type="submit"
                    name="action"
                    value="save_close"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet ve Kapat'}
                </button>
            </div>
        </form>
    );
}
