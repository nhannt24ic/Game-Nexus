// src/pages/HomePage.tsx
import Header from '../components/Header';
import LeftSidebar from '../components/layout/LeftSidebar';
import RightSidebar from '../components/layout/RightSidebar';
import PostFeed from '../components/feed/PostFeed';

const HomePage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <Header />
      <main className="container mx-auto pt-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Cột trái */}
          <aside className="md:col-span-1">
            <LeftSidebar />
          </aside>

          {/* Cột giữa */}
          <section className="md:col-span-2">
            <PostFeed />
          </section>

          {/* Cột phải */}
          <aside className="md:col-span-1">
            <RightSidebar />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HomePage;