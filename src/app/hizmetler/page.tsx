import Breadcrumb from '@/components/Breadcrumb';
import { Metadata } from 'next';
import PageContainer from '@/components/PageContainer';

export const metadata: Metadata = {
    title: 'Hizmetler - Hasan Durmuş',
    description: 'E-ticaret danışmanlığı, SEO optimizasyonu, Google Ads yönetimi ve pazar yeri entegrasyon hizmetlerim.',
};

export default function ServicesPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <PageContainer className="py-2">
                <Breadcrumb items={[
                    { label: 'Ana Sayfa', href: '/' },
                    { label: 'Hizmetler', href: '/hizmetler' },
                ]} />
            </PageContainer>

            <PageContainer className="py-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Hizmetler</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Service 1 */}
                    <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-bold mb-3 text-blue-600">E-ticaret Danışmanlığı</h3>
                        <p className="text-gray-600">
                            Sıfırdan e-ticaret sitesi kurulumu, altyapı seçimi ve süreç yönetimi konularında profesyonel destek.
                        </p>
                    </div>

                    {/* Service 2 */}
                    <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-bold mb-3 text-blue-600">SEO Hizmeti</h3>
                        <p className="text-gray-600">
                            Web sitenizin arama motorlarında üst sıralara çıkması için teknik ve içerik odaklı SEO çalışmaları.
                        </p>
                    </div>

                    {/* Service 3 */}
                    <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-bold mb-3 text-blue-600">Pazaryeri Yönetimi</h3>
                        <p className="text-gray-600">
                            Trendyol, Hepsiburada, Amazon gibi pazaryerlerinde mağaza açılışı ve satış artırıcı stratejiler.
                        </p>
                    </div>
                </div>
            </PageContainer>
        </div>
    );
}
