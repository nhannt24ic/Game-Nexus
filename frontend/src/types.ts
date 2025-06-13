export interface User {
  id: number;
  nickname: string;
  avatar_url: string | null;
  points?: number;
  email?: string;
  bio?: string;
  cover_photo_url?: string;
} 