'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

interface SiteSettings {
    id: string;
    siteName: string;
    siteDescription: string | null;
    logoUrl: string | null;
    faviconUrl: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    googleAnalyticsId: string | null;
    googleTagManagerId: string | null;
    facebookPixelId: string | null;
    customHeadCode: string | null;
    customFooterCode: string | null;
    postsPerPage: number;
    layoutWidth: string;
}

export default function SettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            setSettings(data);
        } catch (error) {
            toast.error('Ayarlar yüklenemedi');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                toast.success('Ayarlar başarıyla kaydedildi!');
            } else {
                toast.error('Kaydetme başarısız');
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: keyof SiteSettings, value: string) => {
        setSettings(prev => prev ? { ...prev, [field]: value } : null);
    };

    if (loading) {
        return <div className="text-center py-12">Yükleniyor...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Site Ayarları</h1>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
                {/* General Settings */}
                <section className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Genel Ayarlar
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Site Adı</label>
                            <input
                                type="text"
                                value={settings?.siteName || ''}
                                onChange={(e) => updateField('siteName', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Site Açıklaması</label>
                            <input
                                type="text"
                                value={settings?.siteDescription || ''}
                                onChange={(e) => updateField('siteDescription', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Anasayfa Yazı Limiti</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={settings?.postsPerPage || 10}
                            onChange={(e) => updateField('postsPerPage', e.target.value)}
                            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Anasayfada listelenecek toplam blog yazısı sayısı.</p>
                    </div>

                    <div className="mt-6 border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sayfa Genişliği</label>
                        <select
                            value={settings?.layoutWidth || 'max-w-6xl'}
                            onChange={(e) => updateField('layoutWidth', e.target.value)}
                            className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="max-w-4xl">Dar (max-w-4xl)</option>
                            <option value="max-w-5xl">Orta (max-w-5xl)</option>
                            <option value="max-w-6xl">Normal (max-w-6xl - Varsayılan)</option>
                            <option value="max-w-7xl">Geniş (max-w-7xl)</option>
                            <option value="max-w-full">Tam Genişlik (Full)</option>
                            <option value="container">Container (Standart)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Sitenin genel içerik genişliğini buradan ayarlayabilirsiniz.</p>
                    </div>
                </section>

                {/* Logo & Favicon */}
                <section className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Logo & Favicon</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Site Logosu</label>
                            <ImageUpload
                                value={settings?.logoUrl || ''}
                                onChange={(url) => updateField('logoUrl', url)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
                            <ImageUpload
                                value={settings?.faviconUrl || ''}
                                onChange={(url) => updateField('faviconUrl', url)}
                            />
                            <p className="text-xs text-gray-500 mt-1">Önerilen: 32x32 veya 64x64 piksel, PNG/ICO format</p>
                        </div>
                    </div>
                </section>

                {/* SEO Settings */}
                <section className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        SEO Ayarları
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Title <span className="text-gray-400">(60 karakter önerilir)</span>
                            </label>
                            <input
                                type="text"
                                value={settings?.metaTitle || ''}
                                onChange={(e) => updateField('metaTitle', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                maxLength={70}
                            />
                            <p className="text-xs text-gray-500 mt-1">{(settings?.metaTitle || '').length}/70 karakter</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Description <span className="text-gray-400">(160 karakter önerilir)</span>
                            </label>
                            <textarea
                                value={settings?.metaDescription || ''}
                                onChange={(e) => updateField('metaDescription', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                maxLength={200}
                            />
                            <p className="text-xs text-gray-500 mt-1">{(settings?.metaDescription || '').length}/200 karakter</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Keywords <span className="text-gray-400">(virgülle ayırın)</span>
                            </label>
                            <input
                                type="text"
                                value={settings?.metaKeywords || ''}
                                onChange={(e) => updateField('metaKeywords', e.target.value)}
                                placeholder="e-ticaret, dijital pazarlama, shopify"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Analytics */}
                <section className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Analytics & Takip Kodları
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                            <input
                                type="text"
                                value={settings?.googleAnalyticsId || ''}
                                onChange={(e) => updateField('googleAnalyticsId', e.target.value)}
                                placeholder="G-XXXXXXXXXX"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Google Tag Manager ID</label>
                            <input
                                type="text"
                                value={settings?.googleTagManagerId || ''}
                                onChange={(e) => updateField('googleTagManagerId', e.target.value)}
                                placeholder="GTM-XXXXXXX"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
                            <input
                                type="text"
                                value={settings?.facebookPixelId || ''}
                                onChange={(e) => updateField('facebookPixelId', e.target.value)}
                                placeholder="XXXXXXXXXXXXXXX"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Özel Head Kodu <span className="text-gray-400">({"<head>"} içine eklenecek)</span>
                            </label>
                            <textarea
                                value={settings?.customHeadCode || ''}
                                onChange={(e) => updateField('customHeadCode', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                placeholder="<!-- Özel script veya meta tagları -->"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Özel Footer Kodu <span className="text-gray-400">({"</body>"} öncesine eklenecek)</span>
                            </label>
                            <textarea
                                value={settings?.customFooterCode || ''}
                                onChange={(e) => updateField('customFooterCode', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                                placeholder="<!-- Özel scriptler -->"
                            />
                        </div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
}
