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

interface StoryCardProps {
  story: Story;
  onStoryClick: (story: Story) => void;
}

const StoryCard: React.FC<StoryCardProps> = ({ story, onStoryClick }) => {
  const user: User = {
    id: story.user_id,
    nickname: story.nickname,
    avatar_url: story.avatar_url,
  };

  const imageUrl = story.image_url || '/default-story-bg.jpg'; // Ảnh nền mặc định cho story

  return (
    <div 
      className="flex-shrink-0 w-24 h-36 rounded-xl relative overflow-hidden shadow-md cursor-pointer 
      hover:shadow-lg transition-shadow duration-200 group"
      style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      onClick={() => onStoryClick(story)}
    >
      {/* Overlay để làm tối ảnh và dễ đọc chữ hơn */}
      <div className="absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-opacity duration-200"></div>
      
      {/* Avatar và tên người dùng */}
      <div className="absolute top-2 left-2 z-10">
        <Avatar user={user} className="w-7 h-7 border-2 border-white" />
      </div>

      {/* Tên người dùng và game tag */}
      <div className="absolute bottom-2 left-2 right-2 z-10 text-white">
        <span className="text-xs font-semibold block truncate">{story.nickname}</span>
        {story.game && (
          <span className="text-xxs block text-gray-200 opacity-80 mt-0.5 truncate">🎮 {story.game}</span>
        )}
      </div>

      {/* Nội dung (nếu có) */}
      {story.content && (
        <div className="absolute inset-0 flex items-center justify-center p-2 text-white text-xs text-center font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <p className="line-clamp-4">{story.content}</p>
        </div>
      )}
    </div>
  );
};

export default StoryCard; 