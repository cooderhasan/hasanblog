import FeaturedSection from '@/components/FeaturedSection';
import BlogListItem from '@/components/BlogListItem';
import Sidebar from '@/components/Sidebar';
import { getPosts, getRecentPosts } from '@/lib/blog'; // Changed import
import prisma from '@/lib/prisma';
import PageContainer from '@/components/PageContainer';
import Pagination from '@/components/Pagination'; // New import

export default async function Home(props: { searchParams?: Promise<{ page?: string, q?: string }> }) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const searchQuery = searchParams?.q || '';
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } });
  const limit = settings?.postsPerPage || 11; // Use setting or default to 11

  // Fetch posts with pagination
  const { posts, totalPages } = await getPosts({ page: currentPage, limit, query: searchQuery });

  // Also fetch recent posts for Sidebar (independent of main feed pagination usually, or same?)
  // Sidebar usually shows "Latest" regardless of page. Let's keep fetching a few for sidebar.
  const sidebarPosts = await getRecentPosts(5);

  let featuredPosts: any[] = [];
  let mainListPosts: any[] = [];

  if (currentPage === 1 && !searchQuery) {
    // Page 1 without search: 4 Featured + 7 List = 11 Total
    featuredPosts = posts.slice(0, 4);
    mainListPosts = posts.slice(4);
  } else {
    // Page > 1 or Searching: 0 Featured + 11 List
    featuredPosts = [];
    mainListPosts = posts;
  }

  return (
    <div className="min-h-screen pt-6 pb-8">
      <PageContainer>

        {searchQuery && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">"{searchQuery}" için arama sonuçları</h1>
            <p className="text-gray-500 mt-2">{posts.length > 0 ? `${posts.length} sonuç listeleniyor.` : 'Aradığınız kritere uygun sonuç bulunamadı.'}</p>
          </div>
        )}

        {/* Featured Section - Only on Page 1 */}
        {currentPage === 1 && featuredPosts.length > 0 && <FeaturedSection posts={featuredPosts} />}

        {/* Main Content Grid - Standardized spacing (mt-6 matches gap-6) */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${(currentPage === 1 && !searchQuery) ? 'mt-6' : 'mt-0'}`}>
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Main Content Box */}
            <div className="bg-white shadow-sm border border-gray-100 p-6 md:p-8">
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
            <Sidebar recentPosts={sidebarPosts} authorImage={settings?.sidebarAboutImage} />
          </div>
        </div>

      </PageContainer>
    </div>
  );
}
