// src/pages/HomePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import LeftSidebar from "../components/layout/LeftSidebar";
import RightSidebar from "../components/layout/RightSidebar";
import PostFeed from "../components/feed/PostFeed";
import CreatePostModal from "../components/feed/CreatePostModal";
import CreateStoryModal from "../components/feed/CreateStoryModal";
import StoryCard from "../components/feed/StoryCard";
import StoryViewModal from "../components/feed/StoryViewModal";
import Avatar from "../components/common/Avatar"; // Đúng path
import type { User } from "../types";

interface Story {
  id: number;
  user_id: number;
  content: string | null;
  image_url: string | null;
  game: string | null;
  created_at: string;
  nickname: string;
  avatar_url: string | null;
}

const HomePage: React.FC = () => {
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCreateStoryModalOpen, setIsCreateStoryModalOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [activePostType, setActivePostType] = useState<
    "general" | "photo" | "game" | "stream"
  >("general");
  const [reloadFeed, setReloadFeed] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetch("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) navigate("/login");
        else setCurrentUser(data);
      })
      .catch(() => navigate("/login"));

    const fetchStories = async () => {
      try {
        const storyRes = await fetch("http://localhost:3000/api/stories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (storyRes.ok) {
          const storyData: Story[] = await storyRes.json();
          setStories(storyData);
        }
      } catch (error) {
        console.error("Lỗi khi lấy stories:", error);
      }
    };
    fetchStories();
  }, [navigate, reloadFeed]);

  const handleOpenCreatePost = (
    type: "general" | "photo" | "game" | "stream" = "general"
  ) => {
    setActivePostType(type);
    setIsCreatePostModalOpen(true);
  };

  const handleStoryCreated = () => {
    setReloadFeed(prev => prev + 1);
    setIsCreateStoryModalOpen(false);
  };

  const handleCreatePost = async (content: string, images: File[]) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const formData = new FormData();
    formData.append("content", content);
    images.forEach((img) => formData.append("images", img));
    try {
      const res = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        setReloadFeed((prev) => prev + 1);
      } else {
        alert("Đăng bài thất bại!");
      }
    } catch {
      alert("Lỗi kết nối backend!");
    }
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <LeftSidebar />
            </div>
          </div>
          {/* Main Feed */}
          <div className="lg:col-span-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🎮</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Welcome to GameNexus
                  </h2>
                  <p className="text-gray-600">Connect with gamers worldwide</p>
                </div>
              </div>
            </div>
            {/* Create Post Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex items-center space-x-4">
                {/* Sử dụng component Avatar với dữ liệu thực tế */}
                {currentUser ? (
                  <Avatar user={currentUser} className="w-10 h-10" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">?</span>
                  </div>
                )}
                <div className="flex-1">
                  <button
                    onClick={() => handleOpenCreatePost("general")}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    What's happening in your gaming world?
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleOpenCreatePost("photo")}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-xl">📸</span>
                  <span className="font-medium">Photo</span>
                </button>
                <button
                  onClick={() => handleOpenCreatePost("game")}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-xl">🎮</span>
                  <span className="font-medium">Game</span>
                </button>
                <button
                  onClick={() => handleOpenCreatePost("stream")}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-xl">📺</span>
                  <span className="font-medium">Stream</span>
                </button>
              </div>
            </div>
            {/* Stories Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Gaming Stories
              </h3>
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {/* Add Story */}
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => setIsCreateStoryModalOpen(true)}
                    className="w-20 h-28 bg-gradient-to-b from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                      <span className="text-white text-lg">+</span>
                    </div>
                    <span className="text-xs text-gray-600 text-center">
                      Add Story
                    </span>
                  </button>
                </div>
                {/* Active Stories */}
                {stories.map((story) => (
                  <StoryCard 
                    key={story.id} 
                    story={story} 
                    onStoryClick={handleStoryClick}
                  />
                ))}
              </div>
            </div>
            {/* Post Feed */}
            <PostFeed key={reloadFeed} />
          </div>
          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <RightSidebar />
            </div>
          </div>
        </div>
      </div>
      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        initialType={activePostType}
        onPostCreated={() => setReloadFeed(reloadFeed + 1)}
        onCreatePost={handleCreatePost}
      />
      {/* Create Story Modal */}
      <CreateStoryModal
        isOpen={isCreateStoryModalOpen}
        onClose={() => setIsCreateStoryModalOpen(false)}
        onStoryCreated={handleStoryCreated}
      />
      {/* Story View Modal */}
      <StoryViewModal
        story={selectedStory}
        stories={stories}
        isOpen={!!selectedStory}
        onClose={() => setSelectedStory(null)}
        onStoryChange={setSelectedStory}
      />
    </div>
  );
};

export default HomePage;
