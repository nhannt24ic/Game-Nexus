import React, { useState } from 'react';

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

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onComment, onShare }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getPostTypeIcon = () => {
    switch (post.type) {
      case 'stream':
        return '📺';
      case 'image':
        return '📸';
      case 'game':
        return '🎮';
      default:
        return '💭';
    }
  };

  const getPostTypeColor = () => {
    switch (post.type) {
      case 'stream':
        return 'from-red-500 to-pink-500';
      case 'image':
        return 'from-purple-500 to-blue-500';
      case 'game':
        return 'from-green-500 to-blue-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const shouldTruncateContent = post.content.length > 200;
  const displayContent = shouldTruncateContent && !showFullContent 
    ? post.content.slice(0, 200) + '...' 
    : post.content;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* User Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">{post.user.avatar}</span>
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            
            {/* User Info */}
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                {post.user.isVerified && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-medium">
                  Lv.{post.user.level}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{post.timestamp}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <span className="text-lg">{getPostTypeIcon()}</span>
                  <span className="capitalize">{post.type || 'post'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* More Options */}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Game Tag */}
        {post.game && (
          <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full">
            <span className="text-sm">🎮</span>
            <span className="text-sm font-medium text-blue-800">{post.game}</span>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="px-6 pb-4">
        <p className="text-gray-900 leading-relaxed">
          {displayContent}
          {shouldTruncateContent && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              className="ml-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {showFullContent ? 'Show less' : 'Read more'}
            </button>
          )}
        </p>
      </div>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className="px-6 pb-4">
          <div className={`grid gap-2 ${
            post.images.length === 1 ? 'grid-cols-1' :
            post.images.length === 2 ? 'grid-cols-2' :
            post.images.length === 3 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {post.images.map((image, index) => (
              <div key={index} className="relative group cursor-pointer">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
                )}
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg"></div>
                {post.images.length > 2 && index === 1 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <span className="text-white text-xl font-bold">+{post.images.length - 2}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="text-red-500">❤️</span>
              <span>{post.likes}</span>
            </span>
            <span>{post.comments} comments</span>
            <span>{post.shares} shares</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex -space-x-2">
              {/* Sample avatars of people who liked */}
              <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full border-2 border-white"></div>
              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full border-2 border-white"></div>
              <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-red-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={onLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              post.isLiked
                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="font-medium">Like</span>
          </button>

          <button
            onClick={onComment}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="font-medium">Comment</span>
          </button>

          <button
            onClick={onShare}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span className="font-medium">Share</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="font-medium">Save</span>
          </button>
        </div>
      </div>

      {/* Quick Comment */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">JD</span>
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Write a comment..."
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;