// src/components/feed/PostCard.tsx

import React from 'react';
import { type Post } from '@/types';
import Avatar from '@/components/common/Avatar';
// Định nghĩa lại kiểu dữ liệu cho một bài viết để component này biết
// props 'post' trông như thế nào.
interface PostCardProps {
  post: Post;
}

// Định nghĩa kiểu cho props của component
interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-gray-900/90 rounded-2xl p-6 shadow-2xl border border-gray-800 text-white mb-2">
      {/* Thông tin tác giả */}
      <div className="flex items-center mb-5">
        <Avatar user={{ 
            id: post.author_id, 
            nickname: post.author_nickname,
            avatar_url: post.author_avatar
        }} className="w-14 h-14 mr-5 ring-2 ring-cyber-purple" />
        <div>
          <p className="font-bold text-lg text-cyber-purple drop-shadow">{post.author_nickname}</p>
          <p className="text-sm text-gray-400">{new Date(post.created_at).toLocaleString('vi-VN')}</p>
        </div>
      </div>
      {/* Nội dung bài viết */}
      {post.content && <p className="mb-5 whitespace-pre-wrap text-base text-gray-200">{post.content}</p>}
      {/* Ảnh */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-5">
          {post.images.map(image => (
            <img 
              key={image.id}
              src={`http://localhost:3000${image.url}`}
              alt={`Post image ${image.id}`}
              className="rounded-xl object-cover w-full h-44 border border-gray-800 shadow-md"
            />
          ))}
        </div>
      )}
      {/* Thống kê like/comment */}
      <div className="flex justify-between items-center text-cyber-purple border-b border-gray-800 pb-2 mb-3">
        <span className="font-semibold">
          {/* Heart icon */}
          <svg className="inline w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 21C12 21 4 13.5 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 3.81 14 5.08C15.09 3.81 16.76 3 18.5 3C21.58 3 24 5.42 24 8.5C24 13.5 16 21 16 21H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
          {post.like_count} lượt thích
        </span>
        <span className="font-semibold">
          <svg className="inline w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h12a2 2 0 012 2z"/></svg>{post.comment_count} bình luận
        </span>
      </div>
      {/* Nút hành động */}
      <div className="flex justify-around items-center gap-2">
        <button className="flex-1 text-center py-2 rounded-xl font-semibold text-cyber-purple bg-gray-800/70 hover:bg-cyber-purple hover:text-white transition-colors">Yêu thích</button>
        <button className="flex-1 text-center py-2 rounded-xl font-semibold text-cyber-purple bg-gray-800/70 hover:bg-cyber-purple hover:text-white transition-colors">Bình luận</button>
      </div>
    </div>
  );
};

// --- DÒNG QUAN TRỌNG NHẤT ĐỂ SỬA LỖI ---
// Dòng này "xuất khẩu" component PostCard làm mặc định cho file.
export default PostCard;