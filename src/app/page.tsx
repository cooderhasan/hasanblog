import FeaturedSection from '@/components/FeaturedSection';
import BlogListItem from '@/components/BlogListItem';
import Sidebar from '@/components/Sidebar';
import { getRecentPosts } from '@/lib/blog';
import prisma from '@/lib/prisma';
import PageContainer from '@/components/PageContainer';

export default async function Home() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } });
  const postLimit = settings?.postsPerPage || 10;

  const recentPosts = await getRecentPosts(postLimit); // Fetch more posts to show in list + sidebar

  // Separate posts for different sections
  const featuredPosts = recentPosts.slice(0, 4); // 1 main + 3 side
  const mainListPosts = recentPosts.slice(4); // Rest for the main feed

  return (
    <div className="bg-white min-h-screen py-8">
      <PageContainer>

        {/* Featured Section */}
        <FeaturedSection posts={featuredPosts} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-2 border-gray-200">
              Son Yazılar
            </h2>

            <div className="flex flex-col gap-6">
              {mainListPosts.length > 0 ? (
                mainListPosts.map((post) => (
                  <BlogListItem key={post.slug} post={post} />
                ))
              ) : (
                <p className="text-gray-500">Henüz başka yazı bulunmamaktadır.</p>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar recentPosts={recentPosts} />


          </div>
        </div>

      </PageContainer>
    </div>
  );
}
