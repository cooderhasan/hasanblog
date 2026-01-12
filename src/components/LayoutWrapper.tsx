import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';
import ClientLayoutWrapper from './ClientLayoutWrapper';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const publicLayout = (
        <>
            <Header />
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
