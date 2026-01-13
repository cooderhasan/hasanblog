import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getPostBySlug, getRecentPosts } from '@/lib/blog';
import Sidebar from '@/components/Sidebar';
import { formatDate } from '@/lib/utils';
// import { serialize } from 'next-mdx-remote/serialize'; // REMOVED
import markdownToHtml from '@/lib/markdownToHtml';
import Breadcrumb from '@/components/Breadcrumb';
import TableOfContents from '@/components/TableOfContents';
import { addHeadingIds } from '@/lib/addHeadingIds';
import CommentList from '@/components/CommentList';
import CommentForm from '@/components/CommentForm';
import prisma from '@/lib/prisma';

export async function generateStaticParams() {
    try {
        const posts = await getAllPosts();
        return posts.map((post) => ({
            slug: post.slug,
        }));
    } catch (error) {
        // Database might not exist during build time
        console.log('generateStaticParams: Database not available, returning empty array');
        return [];
    }
}

export async function generateMetadata(props: any) {
    try {
        const params = await props.params;
        const slug = decodeURIComponent(params.slug);
        const post = await getPostBySlug(slug);

        if (!post) {
            return {
                title: 'Not Found',
                description: 'The page you are looking for does not exist.',
            };
        }

        return {
            title: `${post.title} - Hasan Durmuş`,
            description: post.excerpt,
            openGraph: {
                title: post.title,
                description: post.excerpt,
                type: 'article',
                publishedTime: post.date,
                authors: [post.author],
                images: post.image ? [post.image] : [],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Hasan Durmuş - Blog',
            description: 'Blog posts by Hasan Durmuş',
        };
    }
}

export default async function BlogPostPage(props: any) {
    let params;
    try {
        params = await props.params;
    } catch (e: any) {
        return <h1>Error params: {e.message}</h1>;
    }

    const slug = decodeURIComponent(params.slug);

    let post = null;
    try {
        post = await getPostBySlug(slug);
    } catch (e) {
        return <h1>Error fetch: {e instanceof Error ? e.message : 'Unknown'}</h1>;
    }

    if (!post) {
        notFound();
    }

    // Detect if content is HTML (from new editor) or Markdown (legacy)
    const isHtml = post.content?.trim().startsWith('<');

    let contentHtml = '';
    if (isHtml) {
        contentHtml = post.content || '';
    } else {
        contentHtml = await markdownToHtml(post.content || '');
    }

    const { html: htmlWithIds, toc } = addHeadingIds(contentHtml);
    console.log('[BlogPostPage] Content HTML length:', contentHtml.length);
    // console.log('[BlogPostPage] HTML with IDs sample:', htmlWithIds.substring(0, 200));

    // Fetch related posts used to be here - uncommenting in next step or merge? 
    // I can do it here if I see where it was.
    // It was usually: const allPosts = await getAllPosts(); ...
    // Let's add it back.

    const allPosts = await getAllPosts();
    const relatedPosts = allPosts
        .filter(p => p.category === post.category && p.slug !== post.slug)
        .slice(0, 3);


    const recentPosts = await getRecentPosts(10); // Fetch for Sidebar

    // Fetch approved comments
    const comments = await prisma.comment.findMany({
        where: {
            postId: post.id,
            approved: true
        },
        orderBy: {
            createdAt: 'desc'
        },
        select: {
            id: true,
            name: true,
            content: true,
            createdAt: true,
            adminReply: true,
            adminReplyDate: true
        }
    });

    console.log('[BlogPostPage] Post ID for comments:', post.id, typeof post.id);

    return (
        <div className="bg-white">
            {/* Simple Header */}
            <div className="bg-blue-900 text-white py-12">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <Breadcrumb items={[
                            { label: 'Ana Sayfa', href: '/' },
                            { label: 'Blog', href: '/blog' },
                            { label: post.category, href: `/blog/kategori/${post.category.toLowerCase().replace(/ /g, '-')}` },
                            { label: post.title, href: `/blog/${post.slug}` },
                        ]} />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-4xl">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-blue-100">
                        <span>{post.author}</span>
                        <span>{formatDate(post.date)}</span>
                        <span>{post.category}</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 text-gray-900">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column - Main Article */}
                    <article className="lg:col-span-2">
                        {/* Image */}
                        {post.image && (
                            <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    unoptimized={post.image.startsWith('/uploads/')}
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        {/* Table of Contents */}
                        <TableOfContents toc={toc} />

                        <div
                            className="prose prose-lg max-w-none prose-slate prose-headings:text-gray-900 prose-p:text-gray-800 prose-li:text-gray-800 prose-strong:text-gray-900"
                            dangerouslySetInnerHTML={{ __html: htmlWithIds }}
                        />

                        {/* Comments Section */}
                        <div id="comments" className="mt-16 pt-12 border-t border-gray-200">
                            <CommentList comments={comments} />
                            <CommentForm postId={post.id} />
                        </div>

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div className="mt-16 border-t pt-12">
                                <h2 className="text-2xl font-bold mb-8">İlginizi Çekebilir</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {relatedPosts.map((relatedPost) => (
                                        <Link
                                            key={relatedPost.slug}
                                            href={`/blog/${relatedPost.slug}`}
                                            className="group"
                                        >
                                            {relatedPost.image && (
                                                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={relatedPost.image}
                                                        alt={relatedPost.title}
                                                        fill
                                                        unoptimized={relatedPost.image.startsWith('/uploads/')}
                                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}
                                            <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                                                {relatedPost.title}
                                            </h3>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>

                    {/* Right Column - Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-8">
                            <Sidebar recentPosts={recentPosts} />
                        </div>
                    </aside>
                </div>

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Article',
                            headline: post.title,
                            description: post.excerpt,
                            image: post.image ? [post.image] : [],
                            datePublished: post.date,
                            dateModified: post.date,
                            author: [{
                                '@type': 'Person',
                                name: post.author,
                                url: 'https://hasandurmus.com'
                            }]
                        })
                    }}
                />
            </div>
        </div>
    );
}
