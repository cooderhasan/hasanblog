import FeaturedSection from '@/components/FeaturedSection';
import BlogListItem from '@/components/BlogListItem';
import Sidebar from '@/components/Sidebar';
import { getPosts, getRecentPosts } from '@/lib/blog'; // Changed import
import prisma from '@/lib/prisma';
import PageContainer from '@/components/PageContainer';
import Pagination from '@/components/Pagination'; // New import

export default async function Home(props: { searchParams?: Promise<{ page?: string }> }) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } });
  const limit = settings?.postsPerPage || 11; // Use setting or default to 11

  // Fetch posts with pagination
  const { posts, totalPages } = await getPosts({ page: currentPage, limit });

  // Also fetch recent posts for Sidebar (independent of main feed pagination usually, or same?)
  // Sidebar usually shows "Latest" regardless of page. Let's keep fetching a few for sidebar.
  const sidebarPosts = await getRecentPosts(5);

  let featuredPosts: any[] = [];
  let mainListPosts: any[] = [];

  if (currentPage === 1) {
    // Page 1: 4 Featured + 7 List = 11 Total
    featuredPosts = posts.slice(0, 4);
    mainListPosts = posts.slice(4);
  } else {
    // Page > 1: 0 Featured + 11 List
    featuredPosts = [];
    mainListPosts = posts;
  }

  return (
    <div className="min-h-screen py-8">
      <PageContainer>

        {/* Featured Section - Only on Page 1 */}
        {currentPage === 1 && featuredPosts.length > 0 && <FeaturedSection posts={featuredPosts} />}

        {/* Main Content Grid - Reduced spacing (mt-6 instead of mt-12) */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${currentPage === 1 ? 'mt-6' : 'mt-0'}`}>
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Main Content Box */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="flex flex-col gap-6">
                {mainListPosts.length > 0 ? (
                  <>
                    {mainListPosts.map((post) => (
                      <BlogListItem key={post.slug} post={post} />
                    ))}

                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      baseUrl="/"
                    />
                  </>
                ) : (
                  <p className="text-gray-500">Bu sayfada yazı bulunmamaktadır.</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar recentPosts={sidebarPosts} />
          </div>
        </div>

      </PageContainer>
    </div>
  );
}
