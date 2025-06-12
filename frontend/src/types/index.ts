// src/types/index.ts

// Định nghĩa cấu trúc cho một bài viết
export interface Post {
  id: number;
  content: string | null;
  created_at: string;
  author_id: number;
  author_nickname: string;
  author_avatar: string | null;
  like_count: number;
  comment_count: number;
  images: { id: number; url: string }[] | null;
}

// Định nghĩa cấu trúc cho một người dùng (sẽ dùng ở nhiều nơi)
export interface User {
  id: number;
  nickname: string;
  avatar_url: string | null;
  points?: number; // points có thể có hoặc không
}