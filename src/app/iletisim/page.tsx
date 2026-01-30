import Breadcrumb from '@/components/Breadcrumb';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'İletişim - Hasan Durmuş',
    description: 'Bana ulaşın. E-ticaret danışmanlığı, iş birlikleri ve sorularınız için iletişim formu.',
};

export default function ContactPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-blue-900 text-white py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="mb-4">
                        <Breadcrumb items={[
                            { label: 'Ana Sayfa', href: '/' },
                            { label: 'İletişim', href: '/iletisim' },
                        ]} />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">İletişim</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <p className="text-lg text-gray-700 mb-8 text-center">
                        Projeleriniz veya danışmanlık talepleriniz için aşağıdaki formu doldurarak bana ulaşabilirsiniz.
                    </p>

                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Adınız Soyadınız</label>
                            <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta Adresiniz</label>
                            <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mesajınız</label>
                            <textarea id="message" rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-3"></textarea>
                        </div>
                        <button type="button" className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 font-medium transition-colors">
                            Gönder
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
