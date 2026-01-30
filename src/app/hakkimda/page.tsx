import Breadcrumb from '@/components/Breadcrumb';
import PageContainer from '@/components/PageContainer';

export const metadata = {
    title: 'Hakkımda - Hasan Durmuş',
    description: 'E-ticaret ve dijital pazarlama deneyimlerim hakkında bilgi alın.',
};

export default function AboutPage() {
    return (
        <div className="bg-white min-h-screen">
            <div className="bg-blue-900 text-white py-12">
                <PageContainer>
                    <div className="mb-4">
                        <Breadcrumb items={[
                            { label: 'Ana Sayfa', href: '/' },
                            { label: 'Hakkımda', href: '/hakkimda' },
                        ]} />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Hakkımda</h1>
                </PageContainer>
            </div>

            <PageContainer className="py-12">
                <div className="prose lg:prose-xl max-w-4xl mx-auto">
                    <p className="lead">
                        Merhaba, ben Hasan Durmuş. E-ticaret ve dijital pazarlama alanında 10 yılı aşkın süredir çalışıyorum.
                    </p>
                    <p>
                        Konya'da yaşıyorum ve işletmelere e-ticaret süreçlerini yönetmeleri konusunda danışmanlık veriyorum.
                        Bu blogda tecrübelerimi ve sektörel gelişmeleri paylaşıyorum.
                    </p>
                    <h3>Uzmanlık Alanlarım</h3>
                    <ul>
                        <li>E-ticaret Yönetimi</li>
                        <li>Dijital Pazarlama Stratejileri</li>
                        <li>SEO (Arama Motoru Optimizasyonu)</li>
                        <li>Pazaryeri Entegrasyonları</li>
                    </ul>
                </div>
            </PageContainer>
        </div>
    );
}
