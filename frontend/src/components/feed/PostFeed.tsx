// src/components/feed/PostFeed.tsx
import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";
import { type Post } from "../../types"; // <<< 1. Sử dụng lại type chung
import { useNotifier } from "../../context/NotificationContext";

const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const addNotification = useNotifier();

  useEffect(() => {
    // 2. Viết lại logic fetch cho rõ ràng và thêm lại token
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Người dùng chưa đăng nhập.");
        }

        // 3. Thêm lại header Authorization
        const response = await fetch("http://localhost:3000/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu bài viết.");
        }

        const data: Post[] = await response.json();
        setPosts(data); // 4. Không cần .map() phức tạp nữa!
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Phần JSX giữ nguyên giao diện của bạn, chỉ sửa lại logic handle
  // src/components/feed/PostFeed.tsx

  // ...
  const handleLike = async (postId: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      addNotification("Bạn cần đăng nhập để thực hiện hành động này.", "error");
      return;
    }

    // 1. Tìm bài viết trong state
    const originalPosts = [...posts];
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // 2. Cập nhật giao diện ngay lập tức (Optimistic Update)
    const updatedPosts = posts.map((p) =>
      p.id === postId
        ? {
            ...p,
            isLiked: !p.isLiked,
            like_count: p.isLiked ? p.like_count - 1 : p.like_count + 1,
          }
        : p
    );
    setPosts(updatedPosts);

    // 3. Gửi yêu cầu đến API trong nền
    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/${postId}/like`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Hành động thất bại");
      }
    } catch (error) {
      console.error(error);
      // Hoàn tác thay đổi trên UI nếu có lỗi
      setPosts(originalPosts);

      if (error instanceof Error) {
        addNotification(error.message, "error");
      }
    }
  };

  // src/components/feed/PostFeed.tsx

  const handleCommentSubmit = async (postId: number, content: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );
      if (!response.ok) {
        throw new Error("Bình luận thất bại.");
      }

      // Cập nhật lại số lượng bình luận trên UI
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, comment_count: p.comment_count + 1 } : p
        )
      );
    } catch (error) {
      console.error(error);
      alert("Đã có lỗi xảy ra khi bình luận.");
    }
  };

  const handleShare = (postId: number) => {
    console.log("Share post:", postId);
  };

  if (loading)
    return (
      <div className="text-center p-6 text-gray-500">Đang tải bài viết...</div>
    );
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Bài viết mới nhất
        </h2>
      </div>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={() => handleLike(post.id)}
          onCommentSubmit={handleCommentSubmit}
          onShare={() => handleShare(post.id)}
        />
      ))}
    </div>
  );
};

export default PostFeed;
