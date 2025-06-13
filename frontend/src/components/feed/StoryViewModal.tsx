import React from 'react';
import Avatar from '../common/Avatar';
import type { User } from '../../types';

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

interface StoryViewModalProps {
  story: Story | null;
  stories: Story[];
  isOpen: boolean;
  onClose: () => void;
  onStoryChange: (story: Story) => void;
}

const StoryViewModal: React.FC<StoryViewModalProps> = ({ 
  story, 
  stories,
  isOpen, 
  onClose,
  onStoryChange 
}) => {
  if (!isOpen || !story) return null;

  const user: User = {
    id: story.user_id,
    nickname: story.nickname,
    avatar_url: story.avatar_url,
  };

  const imageUrl = story.image_url || '/default-story-bg.jpg';
  const createdAt = new Date(story.created_at);
  const timeAgo = getTimeAgo(createdAt);

  const currentIndex = stories.findIndex(s => s.id === story.id);
  
  const hasNext = currentIndex < stories.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) {
      onStoryChange(stories[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      onStoryChange(stories[currentIndex - 1]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl h-[80vh] bg-black rounded-2xl overflow-hidden animate-slideUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors duration-200"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation buttons */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Story content */}
        <div className="relative w-full h-full">
          {/* Background image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-75"></div>
          </div>

          {/* Content container */}
          <div className="relative h-full flex flex-col justify-between p-6">
            {/* Header with user info */}
            <div className="flex items-center space-x-3">
              <Avatar user={user} className="w-10 h-10 border-2 border-white" />
              <div className="text-white">
                <h3 className="font-semibold">{story.nickname}</h3>
                <p className="text-sm text-gray-300">{timeAgo}</p>
              </div>
            </div>

            {/* Story content */}
            <div className="flex-grow flex items-center justify-center">
              {story.content && (
                <p className="text-white text-lg font-medium text-center max-w-lg">
                  {story.content}
                </p>
              )}
            </div>

            {/* Footer with game tag */}
            {story.game && (
              <div className="bg-black bg-opacity-50 rounded-lg p-3 inline-flex items-center space-x-2">
                <span className="text-xl">🎮</span>
                <span className="text-white font-medium">{story.game}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' năm trước';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' tháng trước';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' ngày trước';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' giờ trước';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' phút trước';
  
  return Math.floor(seconds) + ' giây trước';
}

export default StoryViewModal; 