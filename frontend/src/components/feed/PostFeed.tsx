// src/components/feed/PostFeed.tsx
import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { type Post } from '@/types';

const PostFeed = ({ reloadFeed = 0 }: { reloadFeed?: number }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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
      const data: Post[] = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [reloadFeed]);

  if (loading) {
    return <div className="text-center p-8 text-gray-400">Đang tải bài viết...</div>;
  }
  return (
    <div className="space-y-8">
      {/* Danh sách bài viết */}
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;