// src/components/feed/PostCard.tsx
import React, { useState } from 'react'; // <<< 1. Import thêm useState
import { type Post } from '../../types';
import Avatar from '../common/Avatar';

// <<< 2. Cập nhật lại interface props
interface PostCardProps {
  post: Post;
  onLike: () => void;
  onCommentSubmit: (postId: number, content: string) => void; // Sửa onComment -> onCommentSubmit
  onShare: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onLike, onCommentSubmit, onShare }) => {
  // <<< 3. Thêm state để quản lý ô input bình luận
  const [commentText, setCommentText] = useState('');

  // <<< 4. Tạo hàm xử lý khi người dùng gửi bình luận
  const handleCommentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn trang tải lại
    if (!commentText.trim()) return; // Nếu bình luận trống thì không làm gì cả
    
    // Gọi hàm được truyền từ PostFeed xuống
    onCommentSubmit(post.id, commentText);
    
    // Xóa nội dung trong ô input sau khi gửi
    setCommentText('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center">
          <Avatar user={{
              id: post.author_id,
              nickname: post.author_nickname,
              avatar_url: post.author_avatar
          }} className="w-12 h-12 mr-3" />
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{post.author_nickname}</h3>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{new Date(post.created_at).toLocaleString('vi-VN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Post Content */}
      {post.content && (
        <div className="px-6 pb-4">
          <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        </div>
      )}

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-1">
          {post.images.map((image) => (
            <div key={image.id} className="relative group cursor-pointer">
              <img
                src={`http://localhost:3000${image.url}`}
                alt={`Post image ${image.id}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="px-6 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span className="hover:underline cursor-pointer">{post.like_count} lượt thích</span>
            <span className="hover:underline cursor-pointer">{post.comment_count} bình luận</span>
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 pt-2">
           <button
             onClick={onLike}
             className={`flex-1 text-center py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                 post.isLiked
                     ? 'text-red-500 bg-red-100 hover:bg-red-200'
                     : 'text-gray-600 hover:bg-gray-100'
             }`}
           >
                <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Thích</span>
            </button>
           {/* Nút bình luận giờ chỉ đểフォーカス vào ô input, hành động chính là ở form dưới */}
           <button className="flex-1 text-center py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">Bình luận</button>
           <button onClick={onShare} className="flex-1 text-center py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium">Chia sẻ</button>
        </div>
      </div>
      
      {/* Quick Comment Form */}
      {/* <<< 5. Bọc khu vực bình luận trong một thẻ <form> */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <form onSubmit={handleCommentFormSubmit} className="flex items-center space-x-3">
          {/* TODO: Lấy thông tin avatar của người dùng đang đăng nhập để hiển thị ở đây */}
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div> 
          <input
            type="text"
            placeholder="Viết một bình luận..."
            className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-cyber-purple"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default PostCard;