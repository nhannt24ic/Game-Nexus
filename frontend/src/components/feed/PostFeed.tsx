// src/components/feed/PostFeed.tsx
import React, { useState } from 'react';
import PostCard from './PostCard';

interface Post {
  id: string;
  user: {
    name: string;
    avatar: string;
    level: number;
    isVerified?: boolean;
  };
  content: string;
  game?: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  type?: 'text' | 'image' | 'game' | 'stream';
}

const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      user: {
        name: 'Alex Chen',
        avatar: '🎯',
        level: 45,
        isVerified: true
      },
      content: 'Just hit Immortal rank in Valorant! 🔥 The grind was real but totally worth it. Thanks to everyone who supported me on this journey!',
      game: 'Valorant',
      images: [],
      timestamp: '2 hours ago',
      likes: 234,
      comments: 45,
      shares: 12,
      isLiked: false,
      type: 'game'
    },
    {
      id: '2',
      user: {
        name: 'Sarah Kim',
        avatar: '⚔️',
        level: 38,
        isVerified: false
      },
      content: 'Epic team fight in our ranked match! Our coordination was on point 💪',
      game: 'League of Legends',
      images: ['https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Epic+Team+Fight'],
      timestamp: '4 hours ago',
      likes: 189,
      comments: 32,
      shares: 8,
      isLiked: true,
      type: 'image'
    },
    {
      id: '3',
      user: {
        name: 'Mike Johnson',
        avatar: '🔫',
        level: 52,
        isVerified: true
      },
      content: 'Going live in 10 minutes! Tonight we\'re pushing for Global Elite. Come hang out and watch the grind! 🎮',
      game: 'CS:GO',
      timestamp: '6 hours ago',
      likes: 156,
      comments: 28,
      shares: 15,
      isLiked: false,
      type: 'stream'
    },
    {
      id: '4',
      user: {
        name: 'Emma Wilson',
        avatar: '🛡️',
        level: 41,
        isVerified: false
      },
      content: 'New season, new heroes to master! Who else is excited for the Overwatch 2 updates? The new support hero looks amazing!',
      game: 'Overwatch 2',
      timestamp: '8 hours ago',
      likes: 203,
      comments: 67,
      shares: 23,
      isLiked: true,
      type: 'text'
    },
    {
      id: '5',
      user: {
        name: 'David Lee',
        avatar: '🎮',
        level: 29,
        isVerified: false
      },
      content: 'Finally got my first win in Apex! The third-party was insane but we clutched it! 🏆',
      game: 'Apex Legends',
      images: ['https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Victory+Screen'],
      timestamp: '12 hours ago',
      likes: 145,
      comments: 19,
      shares: 6,
      isLiked: false,
      type: 'image'
    }
  ]);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, shares: post.shares + 1 }
        : post
    ));
  };

  return (
    <div className="space-y-6">
      {/* Feed Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Latest Posts</h2>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors duration-200">
              Following
            </button>
            <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200">
              Trending
            </button>
            <button className="px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200">
              Recent
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
          onComment={() => handleComment(post.id)}
          onShare={() => handleShare(post.id)}
        />
      ))}

      {/* Load More */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="text-center">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Load More Posts</span>
          </button>
          <p className="text-sm text-gray-500 mt-2">Showing 5 of 127 posts</p>
        </div>
      </div>
    </div>
  );
};

export default PostFeed;