'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function ClientLayoutWrapper({
    publicLayout,
    adminLayout
}: {
    publicLayout: ReactNode;
    adminLayout: ReactNode;
}) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');

    return <>{isAdminPage ? adminLayout : publicLayout}</>;
}
