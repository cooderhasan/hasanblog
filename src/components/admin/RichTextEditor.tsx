'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState, useCallback } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const [seoScore, setSeoScore] = useState({ h1: 0, h2: 0, h3: 0, paragraphs: 0, links: 0, images: 0 });
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadTab, setUploadTab] = useState<'url' | 'upload'>('upload');
    const [isSourceView, setIsSourceView] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Placeholder.configure({
                placeholder: placeholder || 'İçeriğinizi buraya yazın...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
            analyzeSEO(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none min-h-[400px] focus:outline-none p-4 prose-headings:text-gray-900 prose-p:text-gray-900 prose-li:text-gray-900 prose-strong:text-gray-900 prose-a:text-blue-600',
            },
        },
    });

    const analyzeSEO = useCallback((html: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        setSeoScore({
            h1: doc.querySelectorAll('h1').length,
            h2: doc.querySelectorAll('h2').length,
            h3: doc.querySelectorAll('h3').length,
            paragraphs: doc.querySelectorAll('p').length,
            links: doc.querySelectorAll('a').length,
            images: doc.querySelectorAll('img').length,
        });
    }, []);

    // Sync content from prop to editor (e.g. initial load or external update)
    useEffect(() => {
        if (editor && content && content !== editor.getHTML()) {
            // Only update if content is different to avoid cursor jumps/loops
            // Check if the difference is just empty paragraph wrapper
            if (editor.getHTML() === '<p></p>' && !content) return;

            editor.commands.setContent(content);
        }
    }, [content, editor]);

    useEffect(() => {
        if (content) analyzeSEO(content);
    }, [content, analyzeSEO]);

    if (!editor) return null;

    const addLink = () => {
        // Get current selection's link if exists
        const previousUrl = editor.getAttributes('link').href || '';
        setLinkUrl(previousUrl);
        setShowLinkModal(true);
    };

    const confirmLink = () => {
        if (linkUrl) {
            // Add https if not present
            const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        } else {
            editor.chain().focus().unsetLink().run();
        }
        setShowLinkModal(false);
        setLinkUrl('');
    };

    const removeLink = () => {
        editor.chain().focus().unsetLink().run();
        setShowLinkModal(false);
        setLinkUrl('');
    };

    const addImage = () => {
        setImageUrl('');
        setShowImageModal(true);
    };

    const confirmImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
        }
        setShowImageModal(false);
        setImageUrl('');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                setImageUrl(data.url);
                // Optionally auto-insert:
                // editor.chain().focus().setImage({ src: data.url }).run();
                // setShowImageModal(false);
            } else {
                alert('Yükleme başarısız: ' + data.error);
            }
        } catch (error) {
            alert('Bir hata oluştu');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`px-3 py-1.5 rounded text-sm font-medium ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`px-3 py-1.5 rounded text-sm ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}
                >
                    <em>I</em>
                </button>
                <div className="w-px bg-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-3 py-1.5 rounded text-sm font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}
                    title="H1 - Ana Başlık (Sadece 1 tane kullanın)"
                >
                    H1
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1.5 rounded text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}
                    title="H2 - Alt Başlık (Birden fazla kullanabilirsiniz)"
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`px-3 py-1.5 rounded text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}
                    title="H3 - Küçük Başlık"
                >
                    H3
                </button>
                <div className="w-px bg-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`px-3 py-1.5 rounded text-sm ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}
                >
                    • Liste
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`px-3 py-1.5 rounded text-sm ${editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}
                >
                    1. Liste
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`px-3 py-1.5 rounded text-sm ${editor.isActive('blockquote') ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}
                >
                    " Alıntı
                </button>
                <div className="w-px bg-gray-300 mx-1" />
                <button
                    type="button"
                    onClick={addLink}
                    className={`px-3 py-1.5 rounded text-sm ${editor.isActive('link') ? 'bg-blue-600 text-white' : 'bg-white border hover:bg-gray-100'}`}
                >
                    🔗 Link
                </button>
                <button
                    type="button"
                    onClick={addImage}
                    className="px-3 py-1.5 rounded text-sm bg-white border hover:bg-gray-100"
                >
                    🖼️ Resim
                </button>
                <button
                    type="button"
                    onClick={() => setIsSourceView(!isSourceView)}
                    className={`px-3 py-1.5 rounded text-sm font-medium border flex items-center gap-1 ${isSourceView ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-200 hover:bg-gray-100 text-gray-700'}`}
                    title="Kaynak Kodu Görüntüle/Düzenle"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                    </svg>
                    Kod
                </button>
            </div>

            {/* Editor Content or Source View */}
            {isSourceView ? (
                <textarea
                    value={content}
                    onChange={(e) => {
                        const newContent = e.target.value;
                        onChange(newContent);
                        // We don't update editor immediately here to avoid sync issues, 
                        // the useEffect checks content prop changes anyway.
                        // But for smoother experience we can try:
                        editor.commands.setContent(newContent);
                    }}
                    className="w-full h-[400px] p-4 font-mono text-sm bg-gray-900 text-gray-100 focus:outline-none resize-y"
                    spellCheck={false}
                />
            ) : (
                <EditorContent editor={editor} className="bg-white min-h-[400px]" />
            )}

            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowLinkModal(false)}>
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Link Ekle</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        confirmLink();
                                    }
                                }}
                            />
                            <p className="text-xs text-gray-500 mt-1">Önce metni seçin, sonra linki ekleyin</p>
                        </div>
                        <div className="flex gap-2 justify-end">
                            {editor.isActive('link') && (
                                <button
                                    type="button"
                                    onClick={removeLink}
                                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    Linki Kaldır
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={() => setShowLinkModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                İptal
                            </button>
                            <button
                                type="button"
                                onClick={confirmLink}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Ekle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Görsel Ekle</h3>
                        <div className="mb-4">
                            <div className="flex border-b border-gray-200 mb-4">
                                <button
                                    className={`flex-1 pb-2 text-sm font-medium ${uploadTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setUploadTab('upload')}
                                >
                                    Dosya Yükle
                                </button>
                                <button
                                    className={`flex-1 pb-2 text-sm font-medium ${uploadTab === 'url' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setUploadTab('url')}
                                >
                                    URL ile Ekle
                                </button>
                            </div>

                            {uploadTab === 'upload' ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        disabled={isUploading}
                                    />
                                    {isUploading ? (
                                        <div className="text-gray-500 flex flex-col items-center">
                                            <svg className="animate-spin h-6 w-6 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Yükleniyor...
                                        </div>
                                    ) : (
                                        <div className="text-gray-500">
                                            <p className="font-medium">Tıklayın veya sürükleyin</p>
                                            <p className="text-xs mt-1">PNG, JPG, WebP</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                                    <input
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://example.com/resim.jpg"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                confirmImage();
                                            }
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {imageUrl && (
                            <div className="mb-4 p-2 bg-gray-100 rounded-lg relative">
                                <p className="text-xs text-gray-500 mb-2">Önizleme:</p>
                                <img
                                    src={imageUrl}
                                    alt="Önizleme"
                                    className="max-h-32 rounded mx-auto object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                                {uploadTab === 'upload' && !isUploading && (
                                    <button
                                        onClick={() => setImageUrl('')}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowImageModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                İptal
                            </button>
                            <button
                                type="button"
                                onClick={confirmImage}
                                disabled={!imageUrl}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Ekle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SEO Guidance Panel */}
            <div className="bg-gray-50 border-t border-gray-200 p-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">📊 SEO Analizi</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                    <div className={`p-2 rounded ${seoScore.h1 === 1 ? 'bg-green-100 text-green-800' : seoScore.h1 === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        <div className="font-bold">H1: {seoScore.h1}</div>
                        <div>{seoScore.h1 === 1 ? '✓ Mükemmel' : seoScore.h1 === 0 ? '1 tane ekleyin' : 'Sadece 1 olmalı'}</div>
                    </div>
                    <div className={`p-2 rounded ${seoScore.h2 >= 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        <div className="font-bold">H2: {seoScore.h2}</div>
                        <div>{seoScore.h2 >= 2 ? '✓ İyi' : 'En az 2 önerilir'}</div>
                    </div>
                    <div className={`p-2 rounded ${seoScore.h3 >= 1 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                        <div className="font-bold">H3: {seoScore.h3}</div>
                        <div>{seoScore.h3 >= 1 ? '✓ Var' : 'Opsiyonel'}</div>
                    </div>
                    <div className={`p-2 rounded ${seoScore.paragraphs >= 3 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        <div className="font-bold">Paragraf: {seoScore.paragraphs}</div>
                        <div>{seoScore.paragraphs >= 3 ? '✓ Yeterli' : 'Daha fazla içerik'}</div>
                    </div>
                    <div className={`p-2 rounded ${seoScore.links >= 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        <div className="font-bold">Link: {seoScore.links}</div>
                        <div>{seoScore.links >= 1 ? '✓ Var' : 'Link ekleyin'}</div>
                    </div>
                    <div className={`p-2 rounded ${seoScore.images >= 1 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        <div className="font-bold">Resim: {seoScore.images}</div>
                        <div>{seoScore.images >= 1 ? '✓ Var' : 'Görsel ekleyin'}</div>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    💡 <strong>SEO İpuçları:</strong> Her yazıda 1 adet H1 (ana başlık), en az 2 adet H2 (alt başlık), görseller ve iç/dış linkler kullanın.
                </p>
            </div>
        </div>
    );
}
