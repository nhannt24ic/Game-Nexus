// src/pages/HomePage.tsx
import Header from '../components/Header';
import LeftSidebar from '../components/layout/LeftSidebar';
import RightSidebar from '../components/layout/RightSidebar';
import PostFeed from '../components/feed/PostFeed';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto pt-24 px-2 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Cột trái */}
          <aside className="md:col-span-1 mb-6 md:mb-0">
            <div className="bg-gray-800/80 rounded-2xl shadow-lg border border-gray-700 p-4 sticky top-28">
              <LeftSidebar />
            </div>
          </aside>

          {/* Cột giữa */}
          <section className="md:col-span-2 mb-6 md:mb-0">
            <div className="bg-gray-900/80 rounded-2xl shadow-xl border border-gray-700 p-4">
              <PostFeed />
            </div>
          </section>

          {/* Cột phải */}
          <aside className="md:col-span-1">
            <div className="bg-gray-800/80 rounded-2xl shadow-lg border border-gray-700 p-4 sticky top-28">
              <RightSidebar />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HomePage;