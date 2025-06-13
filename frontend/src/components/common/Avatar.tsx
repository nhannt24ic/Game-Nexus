// src/components/common/Avatar.tsx
import React from "react";

interface UserInfo {
  // Chúng ta vẫn giữ lại id và nickname cho các mục đích khác trong tương lai
  id: number;
  nickname: string;
  avatar_url: string | null;
}

interface AvatarProps {
  user: UserInfo;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, className = "w-12 h-12" }) => {
  // Logic chính:
  // 1. Nếu người dùng có avatar_url, hiển thị ảnh thật của họ.
  // 2. Nếu không, hiển thị ảnh mặc định từ thư mục public.

  const imageUrl = user.avatar_url
    ? user.avatar_url.startsWith("http")
      ? user.avatar_url
      : `http://localhost:3000${user.avatar_url}`
    : "/default-avatar.png"; // <<< Đây là đường dẫn đến ảnh mặc định của bạn

  return (
    <img
      src={imageUrl}
      alt={user.nickname}
      className={`${className} rounded-full object-cover border-2 border-gray-600`}
    />
  );
};

export default Avatar;
