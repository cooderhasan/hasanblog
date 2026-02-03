'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

export default function FileUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const [uploadedUrl, setUploadedUrl] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (file: File) => {
        setError('');
        setUploadedUrl('');
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
                setUploadedUrl(data.url);
                toast.success('Dosya yüklendi! Linki kopyalayabilirsiniz.');
            } else {
                setError(data.error || 'Yükleme başarısız');
                toast.error(data.error || 'Yükleme başarısız');
            }
        } catch (err) {
            setError('Yükleme sırasında hata oluştu');
            toast.error('Bağlantı hatası');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(uploadedUrl);
        toast.success('Link kopyalandı!');
    };

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                📎 Dosya Ekle (Excel, PDF vb.)
            </h3>

            <div className="space-y-3">
                <input
                    ref={inputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.xls,.xlsx,.doc,.docx,.zip,.jpg,.png,.webp"
                />

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        disabled={isUploading}
                        className="text-sm px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors flex items-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Yükleniyor...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                Dosya Seç & Yükle
                            </>
                        )}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Maks: 5MB</p>
                </div>

                {error && <p className="text-xs text-red-600">{error}</p>}

                {uploadedUrl && (
                    <div className="bg-green-50 border border-green-200 rounded p-2 flex items-center justify-between gap-2">
                        <div className="text-xs text-green-800 break-all font-mono truncate">
                            {uploadedUrl}
                        </div>
                        <button
                            type="button"
                            onClick={copyToClipboard}
                            className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700 shrink-0"
                        >
                            Kopyala
                        </button>
                    </div>
                )}

                {uploadedUrl && (
                    <p className="text-xs text-gray-600">
                        💡 <strong>Nasıl Eklenir?</strong> Linki kopyalayın, yukarıdaki editörde bir metni seçin (örn: "Dosyayı İndir") ve bağlantı butonuna tıklayıp yapıştırın.
                    </p>
                )}
            </div>
        </div>
    );
}
