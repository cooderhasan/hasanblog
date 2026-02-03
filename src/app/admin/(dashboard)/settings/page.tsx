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
    logoHeight: number;
    sidebarAboutImage: string | null;
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

    const updateField = (field: keyof SiteSettings, value: string | number) => {
        setSettings(prev => prev ? { ...prev, [field]: value } : null);
    };

    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'Genel Ayarlar', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { id: 'seo', label: 'SEO', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
        { id: 'analytics', label: 'Analitik & Kodlar', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' }
    ];

    if (loading) {
        return <div className="text-center py-12">Yükleniyor...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Site Ayarları</h1>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">

                {/* Tabs Header */}
                <div className="bg-white rounded-lg shadow-sm p-2 flex overflow-x-auto space-x-2 border border-gray-100">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap
                                ${activeTab === tab.id
                                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <svg className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                            </svg>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow border border-gray-100 p-8">

                    {/* General Settings Tab */}
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-fadeIn">
                            <h2 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-6">Genel Site Bilgileri</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Adı</label>
                                    <input
                                        type="text"
                                        value={settings?.siteName || ''}
                                        onChange={(e) => updateField('siteName', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Site Açıklaması</label>
                                    <input
                                        type="text"
                                        value={settings?.siteDescription || ''}
                                        onChange={(e) => updateField('siteDescription', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Site Logosu</label>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors">
                                        <ImageUpload
                                            value={settings?.logoUrl || ''}
                                            onChange={(url) => updateField('logoUrl', url)}
                                        />
                                        <div className="mt-4">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Logo Yüksekliği (px)</label>
                                            <input
                                                type="number"
                                                min="20"
                                                max="200"
                                                value={settings?.logoHeight || 48}
                                                onChange={(e) => updateField('logoHeight', parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Favicon</label>
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors">
                                        <ImageUpload
                                            value={settings?.faviconUrl || ''}
                                            onChange={(url) => updateField('faviconUrl', url)}
                                        />
                                        <p className="text-xs text-gray-500 mt-2">Önerilen: 32x32 veya 64x64 piksel, PNG/ICO</p>
                                    </div>
                                </div>
                            </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Sidebar Hakkımda Resmi</label>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors">
                            <ImageUpload
                                value={settings?.sidebarAboutImage || ''}
                                onChange={(url) => updateField('sidebarAboutImage', url)}
                            />
                            <p className="text-xs text-gray-500 mt-2">Sidebar'daki "Hakkımda" alanında görünecek profil resmi.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Anasayfa Yazı Limiti</label>
                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={settings?.postsPerPage || 10}
                            onChange={(e) => updateField('postsPerPage', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1">Sayfa başına gösterilecek blog yazısı sayısı.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sayfa Genişliği</label>
                        <select
                            value={settings?.layoutWidth || 'max-w-6xl'}
                            onChange={(e) => updateField('layoutWidth', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                        >
                            <option value="max-w-4xl">Dar (max-w-4xl)</option>
                            <option value="max-w-5xl">Orta (max-w-5xl)</option>
                            <option value="max-w-6xl">Normal (max-w-6xl)</option>
                            <option value="max-w-7xl">Geniş (max-w-7xl)</option>
                            <option value="max-w-full">Tam Genişlik (Full)</option>
                            <option value="container">Container (Standart)</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">Site içeriğinin maksimum genişliğini belirler.</p>
                    </div>
                </div>
        </div>
    )
}

{/* SEO Settings Tab */ }
{
    activeTab === 'seo' && (
        <div className="space-y-6 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-6">SEO Yapılandırması</h2>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Başlık (Title) <span className={`text-xs ml-1 ${(settings?.metaTitle?.length || 0) > 60 ? 'text-red-500' : 'text-green-600'}`}>
                        ({(settings?.metaTitle || '').length}/60)
                    </span>
                </label>
                <input
                    type="text"
                    value={settings?.metaTitle || ''}
                    onChange={(e) => updateField('metaTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Google arama sonuçlarında görünecek başlık"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Açıklama (Description) <span className={`text-xs ml-1 ${(settings?.metaDescription?.length || 0) > 160 ? 'text-red-500' : 'text-green-600'}`}>
                        ({(settings?.metaDescription || '').length}/160)
                    </span>
                </label>
                <textarea
                    value={settings?.metaDescription || ''}
                    onChange={(e) => updateField('metaDescription', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Google arama sonuçlarında görünecek kısa açıklama"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Anahtar Kelimeler (Keywords)</label>
                <input
                    type="text"
                    value={settings?.metaKeywords || ''}
                    onChange={(e) => updateField('metaKeywords', e.target.value)}
                    placeholder="e-ticaret, blog, teknoloji (virgülle ayırın)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 transition-all"
                />
            </div>
        </div>
    )
}

{/* Analytics Tab */ }
{
    activeTab === 'analytics' && (
        <div className="space-y-8 animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-4 mb-6">Takip Kodları ve Entegrasyonlar</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" /></svg>
                        </div>
                        <input
                            type="text"
                            value={settings?.googleAnalyticsId || ''}
                            onChange={(e) => updateField('googleAnalyticsId', e.target.value)}
                            placeholder="G-XXXXXXXXXX"
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Google Tag Manager ID</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                        </div>
                        <input
                            type="text"
                            value={settings?.googleTagManagerId || ''}
                            onChange={(e) => updateField('googleTagManagerId', e.target.value)}
                            placeholder="GTM-XXXXXXX"
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                        </div>
                        <input
                            type="text"
                            value={settings?.facebookPixelId || ''}
                            onChange={(e) => updateField('facebookPixelId', e.target.value)}
                            placeholder="XXXXXXXXXXXXXXX"
                            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Özel Head Kodu <span className="text-gray-400 font-normal">({"<head>"})</span>
                    </label>
                    <div className="relative">
                        <textarea
                            value={settings?.customHeadCode || ''}
                            onChange={(e) => updateField('customHeadCode', e.target.value)}
                            rows={6}
                            className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-xs text-gray-600 leading-relaxed"
                            placeholder="<!-- Google Analytics vb. kodları buraya yapıştırın -->"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Özel Footer Kodu <span className="text-gray-400 font-normal">({"</body>"})</span>
                    </label>
                    <div className="relative">
                        <textarea
                            value={settings?.customFooterCode || ''}
                            onChange={(e) => updateField('customFooterCode', e.target.value)}
                            rows={6}
                            className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-xs text-gray-600 leading-relaxed"
                            placeholder="<!-- Chat bot vb. scriptleri buraya yapıştırın -->"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

{/* Action Bar */ }
<div className="mt-8 pt-6 border-t flex items-center justify-between">
    <p className="text-sm text-gray-500">
        {saving ? 'Kaydediliyor...' : 'Değişiklikleri kaydetmeyi unutmayın.'}
    </p>
    <button
        type="submit"
        disabled={saving}
        className={`px-8 py-3 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2
                                ${saving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5'}`}
    >
        {saving ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Kaydediliyor
            </>
        ) : (
            <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Ayarları Kaydet
            </>
        )}
    </button>
</div>

                </div >
            </form >
        </div >
    );
}
