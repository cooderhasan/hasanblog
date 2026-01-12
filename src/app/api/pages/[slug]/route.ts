import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const page = await prisma.page.findUnique({
            where: { slug }
        });

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error('Get page error:', error);
        return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const data = await request.json();

        const page = await prisma.page.update({
            where: { slug },
            data: {
                title: data.title,
                content: data.content,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                isActive: data.isActive,
            }
        });

        return NextResponse.json({ success: true, page });
    } catch (error) {
        console.error('Update page error:', error);
        return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
    }
}
