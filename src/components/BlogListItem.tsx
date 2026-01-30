import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface BlogListItemProps {
    post: BlogPost;
}

export default function BlogListItem({ post }: BlogListItemProps) {
    return (
        <article className="flex flex-col md:flex-row gap-6 pb-8 border-b border-gray-100 last:border-b-0">
            {/* Image Section */}
            <div className="md:w-5/12 lg:w-1/3 relative h-56 md:h-auto min-h-[220px] rounded-xl overflow-hidden shrink-0 group">
                <Link href={`/blog/${post.slug}`}>
                    {post.image ? (
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            unoptimized={post.image.startsWith('/uploads/')}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            <span className="text-4xl">📷</span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Content Section */}
            <div className="md:w-7/12 lg:w-2/3 flex flex-col justify-start py-1">
                {/* Category */}
                <div className="mb-3">
                    <Link
                        href={`/blog/kategori/${post.category.toLowerCase().replace(/ /g, '-')}`}
                        className="inline-block px-3 py-1 text-xs font-bold text-white bg-teal-400 rounded-md hover:bg-teal-500 transition-colors uppercase tracking-wide"
                    >
                        {post.category}
                    </Link>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 leading-tight group">
                    <Link href={`/blog/${post.slug}`} className="hover:text-teal-500 transition-colors">
                        {post.title}
                    </Link>
                </h2>

                {/* Meta Info */}
                <div className="flex items-center text-xs md:text-sm text-gray-400 mb-4 font-medium">
                    <span className="text-gray-600 mr-1">{post.author}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(post.date)}</span>
                    <span className="mx-2">•</span>
                    <span>0 Yorum</span> {/* Placeholder for comments count if not available in post object yet */}
                </div>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                </p>

                {/* Read More (Optional, keeping it minimal implies just title link might be enough, but user didn't explicitly ask to remove it. 
                   The reference image usually has title/excerpt. I'll stick to the reference style which seems clean.) */}
            </div>
        </article>
    );
}
