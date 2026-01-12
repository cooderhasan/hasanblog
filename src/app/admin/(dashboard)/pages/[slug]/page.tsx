import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditPageClient from '@/components/admin/EditPageClient';

interface EditPageProps {
    params: Promise<{ slug: string }>;
}

export default async function EditPagePage({ params }: EditPageProps) {
    const { slug } = await params;

    const page = await prisma.page.findUnique({
        where: { slug }
    });

    if (!page) {
        notFound();
    }

    return <EditPageClient initialPage={page} />;
}
