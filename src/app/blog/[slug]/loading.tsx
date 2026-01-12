export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
                {/* Breadcrumb skeleton */}
                <div className="flex gap-2 mb-6">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>

                {/* Title skeleton */}
                <div className="h-12 bg-gray-200 rounded w-3/4 mb-4"></div>

                {/* Meta skeleton */}
                <div className="flex gap-4 mb-8">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        {/* Image skeleton */}
                        <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>

                        {/* Content skeleton */}
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        </div>
                    </div>

                    {/* Sidebar skeleton */}
                    <div className="lg:col-span-1">
                        <div className="h-64 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
