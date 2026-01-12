'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const [seoScore, setSeoScore] = useState({ h1: 0, h2: 0, h3: 0, paragraphs: 0, links: 0, images: 0 });

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
            }),
            Image,
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

    const analyzeSEO = (html: string) => {
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
    };

    useEffect(() => {
        if (content) analyzeSEO(content);
    }, []);

    if (!editor) return null;

    const addLink = () => {
        const url = prompt('Link URL:');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const addImage = () => {
        const url = prompt('Resim URL:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
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
                    className="px-3 py-1.5 rounded text-sm bg-white border hover:bg-gray-100"
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
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} className="bg-white" />

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
