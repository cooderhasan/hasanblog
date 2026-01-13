import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import ClientLayoutWrapper from './ClientLayoutWrapper';
import prisma from '@/lib/prisma';

export default async function LayoutWrapper({ children }: { children: React.ReactNode }) {
    let settings;
    try {
        settings = await prisma.siteSettings.findUnique({
            where: { id: 'main' }
        });
    } catch (e) {
        console.error('Failed to fetch settings in layout', e);
    }

    const publicLayout = (
        <>
            <Header logoUrl={settings?.logoUrl} />
            <main className="min-h-screen">
                {children}
            </main>
            <WhatsappButton />
            <Footer />
        </>
    );

    const adminLayout = <>{children}</>;

    return (
        <ClientLayoutWrapper
            publicLayout={publicLayout}
            adminLayout={adminLayout}
        />
    );
}
