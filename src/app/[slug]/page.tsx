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
import PageContainer from '@/components/PageContainer';

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
            {/* Simple Header / Breadcrumb Area */}
            <div className="py-4 bg-gray-50">
                <PageContainer>
                    <Breadcrumb items={[
                        { label: 'Ana Sayfa', href: '/' },
                        { label: post.category, href: `/kategori/${post.categorySlug}` },
                        { label: post.title, href: `/${post.slug}` },
                    ]} />
                </PageContainer>
            </div>

            <div className="bg-gray-50 min-h-screen py-12">
                <PageContainer>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <article className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Featured Image Removed at User Request */}

                            <div className="p-6 md:p-8">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-yellow-100">
                                    {post.title}
                                </h1>

                                <div className="flex items-center text-sm text-gray-500 mb-8 pb-4 border-b">
                                    <span className="font-medium text-blue-600 mr-4">{post.author}</span>
                                    <span className="mr-4">{formatDate(post.date)}</span>
                                    <span className="bg-gray-100 px-2 py-1 rounded-md">{post.category}</span>
                                </div>

                                <div
                                    className="prose prose-lg max-w-none prose-blue prose-headings:text-gray-900 prose-p:text-gray-800 prose-strong:text-gray-900 prose-li:text-gray-800 text-gray-900"
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </div>
                        </article>

                        {/* Related Posts */}
                        {relatedPosts.length > 0 && (
                            <div className="my-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 px-1">İlginizi Çekebilir</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {relatedPosts.map((rp) => (
                                        <Link
                                            key={rp.slug}
                                            href={`/${rp.slug}`}
                                            className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100"
                                        >
                                            <div className="relative h-48 w-full overflow-hidden">
                                                {rp.image ? (
                                                    <Image
                                                        src={rp.image}
                                                        alt={rp.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <span className="text-sm">Görsel Yok</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700 shadow-sm">
                                                    {formatDate(rp.date)}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                                    {rp.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {rp.excerpt || 'İçerik özeti bulunmuyor.'}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comments Section */}
                        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8" id="comments">
                            <CommentList comments={comments} />
                            <div className="mt-8 pt-8 border-t border-gray-100">
                                <CommentForm postId={post.id} />
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1 space-y-8">
                            {/* Sidebar content */}
                            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Son Yazılar</h3>
                                <div className="flex flex-col gap-4">
                                    {recentPosts.map((recent) => (
                                        <Link key={recent.slug} href={`/${recent.slug}`} className="flex gap-3 group">
                                            <div className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden">
                                                {recent.image ? (
                                                    <Image
                                                        src={recent.image}
                                                        alt={recent.title}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-xs text-gray-400">No Img</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {recent.title}
                                                </h4>
                                                <span className="text-xs text-gray-400 mt-1 block">
                                                    {formatDate(recent.date)}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </aside>
                    </div>
                </PageContainer>
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
