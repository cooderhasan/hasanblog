import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// Update post
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { title, slug, excerpt, content, image, categoryId } = body;

        // Check if slug exists for another post
        const existing = await prisma.post.findFirst({
            where: { slug, NOT: { id } },
        });
        if (existing) {
            return NextResponse.json(
                { error: 'Bu URL adresi başka bir yazıda kullanılıyor' },
                { status: 400 }
            );
        }

        const post = await prisma.post.update({
            where: { id },
            data: {
                title,
                slug,
                excerpt,
                content,
                image: image || null,
                categoryId,
            },
        });

        return NextResponse.json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        return NextResponse.json(
            { error: 'Yazı güncellenirken bir hata oluştu' },
            { status: 500 }
        );
    }
}

// Delete post
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;

        await prisma.post.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Yazı silinirken bir hata oluştu' },
            { status: 500 }
        );
    }
}
