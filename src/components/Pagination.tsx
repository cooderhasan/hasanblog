import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl?: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl = '/' }: PaginationProps) {
    if (totalPages <= 1) return null;

    const prevPage = currentPage > 1 ? currentPage - 1 : null;
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            {prevPage && (
                <Link
                    href={`${baseUrl}?page=${prevPage}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
                >
                    &larr; Önceki
                </Link>
            )}

            <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show current, first, last, and neighbors
                    if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                        return (
                            <Link
                                key={page}
                                href={`${baseUrl}?page=${page}`}
                                className={`px-4 py-2 rounded-md ${currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </Link>
                        );
                    } else if (
                        (page === currentPage - 2 && page > 1) ||
                        (page === currentPage + 2 && page < totalPages)
                    ) {
                        return <span key={page} className="text-gray-400">...</span>;
                    }
                    return null;
                })}
            </div>

            {nextPage && (
                <Link
                    href={`${baseUrl}?page=${nextPage}`}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
                >
                    Sonraki &rarr;
                </Link>
            )}
        </div>
    );
}
