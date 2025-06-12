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
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg text-white">
      {/* Phần thông tin tác giả */}
      <div className="flex items-center mb-4">
        <Avatar user={{ 
            id: post.author_id, 
            nickname: post.author_nickname,
            avatar_url: post.author_avatar
        }} className="w-12 h-12 mr-4" />
        <div>
          <p className="font-bold">{post.author_nickname}</p>
          <p className="text-sm text-gray-400">
            {new Date(post.created_at).toLocaleString('vi-VN')}
          </p>
        </div>
      </div>

      {/* Phần nội dung bài viết */}
      {post.content && <p className="mb-4 whitespace-pre-wrap">{post.content}</p>}

      {/* Phần hiển thị nhiều ảnh (nếu có) */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {post.images.map(image => (
            <img 
              key={image.id}
              src={`http://localhost:3000${image.url}`} // Thêm domain của backend vào
              alt={`Post image ${image.id}`}
              className="rounded-lg object-cover w-full h-full"
            />
          ))}
        </div>
      )}

      {/* Phần thống kê like/comment */}
      <div className="flex justify-between items-center text-gray-400 border-b border-gray-700 pb-2 mb-2">
        <span>{post.like_count} lượt thích</span>
        <span>{post.comment_count} bình luận</span>
      </div>
      
      {/* Phần các nút hành động (Like, Comment, Share) */}
      <div className="flex justify-around items-center">
        <button className="flex-1 text-center py-2 rounded-lg hover:bg-gray-700 transition-colors">Thích</button>
        <button className="flex-1 text-center py-2 rounded-lg hover:bg-gray-700 transition-colors">Bình luận</button>
        <button className="flex-1 text-center py-2 rounded-lg hover:bg-gray-700 transition-colors">Chia sẻ</button>
      </div>
    </div>
  );
};

// --- DÒNG QUAN TRỌNG NHẤT ĐỂ SỬA LỖI ---
// Dòng này "xuất khẩu" component PostCard làm mặc định cho file.
export default PostCard;