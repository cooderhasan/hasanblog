import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface BlogListItemProps {
    post: BlogPost;
}

export default function BlogListItem({ post }: BlogListItemProps) {
    return (
        <article className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="md:w-1/3 relative h-48 md:h-auto min-h-[200px] rounded-lg overflow-hidden shrink-0">
                <Link href={`/blog/${post.slug}`}>
                    {post.image ? (
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200" />
                    )}
                </Link>
                {/* Category Badge Over Image */}
                <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded shadow-sm">
                        {post.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                    <span className="font-medium text-gray-700">{post.author}</span>
                    <span>•</span>
                    <span>{formatDate(post.date)}</span>
                    {post.readingTime && (
                        <>
                            <span>•</span>
                            <span>{post.readingTime}</span>
                        </>
                    )}
                </div>

                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-green-600 transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed">
                    {post.excerpt}
                </p>

                <div>
                    <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
                    >
                        Devamını Oku
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </article>
    );
}
