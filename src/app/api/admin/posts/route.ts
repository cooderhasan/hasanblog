import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// Create new post
export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, slug, excerpt, content, image, categoryId } = body;

        // Check if slug already exists
        const existing = await prisma.post.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json(
                { error: 'Bu URL adresi zaten kullanılıyor' },
                { status: 400 }
            );
        }

        // Get default author (first author in DB)
        const author = await prisma.author.findFirst();
        if (!author) {
            return NextResponse.json(
                { error: 'Yazar bulunamadı. Önce bir yazar ekleyin.' },
                { status: 400 }
            );
        }

        const post = await prisma.post.create({
            data: {
                title,
                slug,
                excerpt,
                content,
                image: image || null,
                date: new Date(),
                categoryId,
                authorId: author.id,
            },
        });

        return NextResponse.json(post, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Yazı oluşturulurken bir hata oluştu' },
            { status: 500 }
        );
    }
}
