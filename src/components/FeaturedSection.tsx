import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface FeaturedSectionProps {
    posts: BlogPost[];
}

export default function FeaturedSection({ posts }: FeaturedSectionProps) {
    if (!posts || posts.length === 0) return null;

    const mainPost = posts[0];
    const sidePosts = posts.slice(1, 4); // Next 3 posts

    return (
        <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Large Post */}
                <div className="lg:col-span-2 relative h-[400px] lg:h-[420px] rounded-xl overflow-hidden group">
                    <Link href={`/blog/${mainPost.slug}`} className="block h-full w-full">
                        {mainPost.image ? (
                            <Image
                                src={mainPost.image}
                                alt={mainPost.title}
                                fill
                                unoptimized={mainPost.image.startsWith('/uploads/')}
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200" />
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-8">
                            <span className="inline-block px-3 py-1 mb-3 text-xs md:text-sm font-semibold text-white bg-green-600 rounded w-fit">
                                {mainPost.category}
                            </span>
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                                {mainPost.title}
                            </h2>
                            <div className="flex items-center text-gray-300 text-sm gap-4">
                                <span>{mainPost.author}</span>
                                <span>•</span>
                                <span>{formatDate(mainPost.date)}</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Side Posts Stack */}
                <div className="flex flex-col gap-6">
                    {sidePosts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="flex-1 group relative rounded-xl overflow-hidden block min-h-[150px]">
                            {post.image ? (
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    unoptimized={post.image.startsWith('/uploads/')}
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4">
                                <span className="text-xs font-semibold text-green-400 mb-1">
                                    {post.category}
                                </span>
                                <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                                    {post.title}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
