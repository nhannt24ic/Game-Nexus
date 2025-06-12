// src/components/feed/PostFeed.tsx
import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { type Post } from '@/types';

// Giao diện Post cũ đã được xóa

const PostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

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

  // Xử lý chọn ảnh và preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImages(files);
      setPreviewUrls(files.map(file => URL.createObjectURL(file)));
    }
  };

  // Xử lý submit bài viết
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;
    setSubmitting(true);
    // ...gửi API tạo bài viết ở đây...
    // Sau khi thành công:
    setContent("");
    setImages([]);
    setPreviewUrls([]);
    setShowForm(false);
    setSubmitting(false);
    // ...cập nhật lại feed nếu muốn...
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-400">Đang tải bài viết...</div>;
  }
  return (
    <div className="space-y-8">
      {/* Box tạo bài viết */}
      <div className="bg-gradient-to-r from-cyber-purple/30 to-cyber-blue/20 p-5 rounded-2xl shadow-lg border border-cyber-purple text-gray-300 font-semibold mb-2">
        {!showForm ? (
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowForm(true)}>
            <span className="bg-cyber-purple text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">+</span>
            <span className="text-gray-400">Bạn đang nghĩ gì? Chia sẻ với cộng đồng...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              className="w-full bg-gray-900/80 rounded-xl p-3 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-cyber-purple resize-none min-h-[80px]"
              placeholder="Chia sẻ cảm nghĩ của bạn..."
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={500}
              required={!images.length}
            />
            {/* Ảnh preview */}
            {previewUrls.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url} alt="preview" className="w-24 h-24 object-cover rounded-lg border border-gray-700" />
                    <button type="button" className="absolute top-1 right-1 bg-gray-900/80 rounded-full p-1 text-red-400 hover:bg-gray-800" onClick={() => {
                      setImages(images.filter((_, i) => i !== idx));
                      setPreviewUrls(previewUrls.filter((_, i) => i !== idx));
                    }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-cyber-purple/80 hover:bg-cyber-purple text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                Thêm ảnh
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
              </label>
              <button type="submit" disabled={submitting || (!content.trim() && images.length === 0)} className="bg-cyber-blue/80 hover:bg-cyber-blue text-white px-6 py-2 rounded-lg font-bold transition-colors disabled:opacity-60">
                {submitting ? 'Đang đăng...' : 'Đăng bài'}
              </button>
              <button type="button" className="ml-auto text-gray-400 hover:text-red-400" onClick={() => setShowForm(false)}>
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>
      {/* Danh sách bài viết */}
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;