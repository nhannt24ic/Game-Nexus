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
  isLiked: boolean;
}

// Định nghĩa cấu trúc cho một người dùng (sẽ dùng ở nhiều nơi)
export interface User {
  id: number;
  nickname: string;
  avatar_url: string | null;
  points?: number; // points có thể có hoặc không
}
export interface Notification {
  id: number;
  message: string;
  type: "success" | "error" | "info"; // Các loại thông báo
}
export interface UserSearchResult {
  id: number;
  nickname: string;
  avatar_url: string | null;
  friendship_id: number | null;
  friendship_status: "pending" | "accepted" | null;
  action_user_id: number | null;
}

export interface IncomingRequest {
  id: number; // id của lời mời trong bảng friendships
  sender_id: number;
  nickname: string;
  avatar_url: string | null;
}
