'use server';

import { signOut } from '@/auth';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { generateSlug } from '@/lib/utils';

export async function handleSignOut() {
    await signOut({ redirectTo: '/admin/login' });
}

export async function deletePost(id: string) {
    try {
        await prisma.post.delete({
            where: { id },
        });
        revalidatePath('/admin/posts');
        revalidatePath('/blog');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete post:', error);
        return { success: false, error: 'Failed to delete post' };
    }
}

export async function createPost(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const categoryId = formData.get('categoryId') as string;
    const excerpt = formData.get('excerpt') as string;
    const image = formData.get('image') as string;
    const published = formData.get('published') === 'on';
    const focusKeyword = formData.get('focusKeyword') as string;

    if (!title || !content || !categoryId) {
        return;
    }

    let slug = generateSlug(title);

    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.post.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    let isSuccess = false;

    try {
        let author = await prisma.author.findFirst();
        if (!author) {
            // Create default author if none exists
            console.log('No author found, creating default author...');
            author = await prisma.author.create({
                data: {
                    name: 'Admin',
                    bio: 'Site Yöneticisi',
                    avatar: '/images/default-avatar.png'
                }
            });
        }

        await prisma.post.create({
            data: {
                title,
                slug: uniqueSlug,
                content,
                excerpt,
                image,
                published,
                focusKeyword,
                categoryId,
                authorId: author.id,
            },
        });

        revalidatePath('/admin/posts');
        revalidatePath('/blog');
        revalidatePath('/');
        isSuccess = true;
    } catch (error) {
        console.error('Create Post Error:', error);
        return { success: false, error: 'Yazı oluşturulurken bir hata oluştu.' };
    }

    if (isSuccess) {
        return { success: true };
    }
}

export async function updatePost(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const categoryId = formData.get('categoryId') as string;
    const excerpt = formData.get('excerpt') as string;
    const image = formData.get('image') as string;
    const published = formData.get('published') === 'on';
    const focusKeyword = formData.get('focusKeyword') as string;

    let isSuccess = false;

    try {
        await prisma.post.update({
            where: { id },
            data: {
                title,
                content,
                categoryId,
                excerpt,
                image,
                published,
                focusKeyword,
            },
        });

        revalidatePath('/admin/posts');
        revalidatePath('/blog');
        revalidatePath('/');
        isSuccess = true;
    } catch (error) {
        console.error('Update Post Error:', error);
        return { success: false, error: 'Yazı güncellenirken bir hata oluştu.' };
    }

    if (isSuccess) {
        return { success: true };
    }
}

// Category Actions

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;

    if (!name) return;

    let slug = generateSlug(name);

    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.category.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    try {
        await prisma.category.create({
            data: { name, slug: uniqueSlug }
        });
    } catch (error) {
        console.error('Create Category Error:', error);
        return { success: false, error: 'Failed to create category' };
    }

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function updateCategory(id: string, formData: FormData) {
    const name = formData.get('name') as string;

    await prisma.category.update({
        where: { id },
        data: { name }
    });

    revalidatePath('/admin/categories');
    revalidatePath('/blog');
    redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id }
        });
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (error) {
        console.error('Delete Category Error:', error);
        return { success: false, error: 'Failed to delete category' };
    }
}


// Comment Actions

export async function createComment(formData: FormData) {
    const postId = formData.get('postId') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const content = formData.get('content') as string;
    const path = formData.get('path') as string; // To revalidate

    console.log('[createComment] Received submission:', {
        postId, name, email, content: content?.substring(0, 20), path
    });


    // Honeypot check (hidden field that should be empty)
    const honeypot = formData.get('website') as string;
    if (honeypot) {
        console.log('Spam detected via honeypot');
        return { success: false, error: 'Spam detected' };
    }

    if (!postId || !name || !email || !content) {
        return { success: false, error: 'Tüm alanları doldurunuz.' };
    }

    try {
        await prisma.comment.create({
            data: {
                postId,
                name,
                email,
                content,
                approved: false // Default to unapproved
            }
        });

        if (path) {
            revalidatePath(path);
        }

        return { success: true, message: 'Yorumunuz alındı. Yönetici onayından sonra yayınlanacaktır.' };
    } catch (error) {
        console.error('Create Comment Error:', error);
        return { success: false, error: 'Yorum gönderilirken bir hata oluştu.' };
    }
}

export async function approveComment(id: string) {
    try {
        await prisma.comment.update({
            where: { id },
            data: { approved: true }
        });
        revalidatePath('/admin/comments');
        revalidatePath('/blog'); // Revalidate blog pages to show new comment
        return { success: true };
    } catch (error) {
        console.error('Approve Comment Error:', error);
        return { success: false, error: 'Failed to approve comment' };
    }
}

export async function deleteComment(id: string) {
    try {
        await prisma.comment.delete({
            where: { id }
        });
        revalidatePath('/admin/comments');
        revalidatePath('/blog');
        return { success: true };
    } catch (error) {
        console.error('Delete Comment Error:', error);
        return { success: false, error: 'Failed to delete comment' };
    }
}

export async function replyToComment(id: string, reply: string) {
    try {
        await prisma.comment.update({
            where: { id },
            data: {
                adminReply: reply,
                adminReplyDate: new Date()
            }
        });
        revalidatePath('/admin/comments');
        revalidatePath('/blog');
        return { success: true };
    } catch (error) {
        console.error('Reply Comment Error:', error);
        return { success: false, error: 'Failed to reply to comment' };
    }
}
