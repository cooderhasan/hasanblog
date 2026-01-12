'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsappButton from '@/components/WhatsappButton';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');

    if (isAdminPage) {
        // Admin pages: no header, footer, or whatsapp button
        return <>{children}</>;
    }

    // Public pages: show header, footer, etc.
    return (
        <>
            <Header />
            <main className="min-h-screen">
                {children}
            </main>
            <WhatsappButton />
            <Footer />
        </>
    );
}
