import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.slug}`} className="group block">
            <article className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl">
                {/* Image */}
                {post.image && (
                    <div className="relative h-48 w-full overflow-hidden">
                        <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="p-6">
                    {/* Category */}
                    <div className="mb-2">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-green-600 bg-green-50 rounded-full">
                            {post.category}
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                        {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(post.date)}</span>
                        {post.readingTime && <span>{post.readingTime}</span>}
                    </div>
                </div>
            </article>
        </Link>
    );
}
