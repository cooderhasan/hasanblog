import prisma from '@/lib/prisma';
import { ReactNode } from 'react';

interface PageContainerProps {
    children: ReactNode;
    className?: string;
}

export default async function PageContainer({ children, className = '' }: PageContainerProps) {
    let widthClass = 'max-w-6xl';

    try {
        const settings = await prisma.siteSettings.findUnique({
            where: { id: 'main' },
            select: { layoutWidth: true }
        });

        if (settings?.layoutWidth) {
            widthClass = settings.layoutWidth;
        }
    } catch (e) {
        console.error('Failed to fetch layout width', e);
    }

    return (
        <div className={`${widthClass} mx-auto px-4 ${className}`}>
            {children}
        </div>
    );
}
