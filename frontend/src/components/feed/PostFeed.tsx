// src/components/feed/PostFeed.tsx
import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { type Post } from '@/types';

// Giao diện Post cũ đã được xóa

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/api/posts', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Không thể tải bài viết');
        }
        // TypeScript giờ sẽ tự động kiểm tra xem dữ liệu trả về
        // có khớp với interface Post đã import không.
        const data: Post[] = await response.json();
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center p-8 text-gray-400">Đang tải bài viết...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-4 rounded-lg text-gray-400">Tạo bài viết...</div>

      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;