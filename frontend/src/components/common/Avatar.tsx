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
  src?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, className = "w-12 h-12", src }) => {
  // Logic chính:
  // 1. Ưu tiên sử dụng src prop nếu có.
  // 2. Nếu không, kiểm tra user.avatar_url.
  // 3. Nếu không, hiển thị ảnh mặc định từ thư mục public.

  const finalImageUrl = src 
    ? src
    : user.avatar_url
      ? user.avatar_url.startsWith("http")
        ? user.avatar_url
        : `http://localhost:3000${user.avatar_url}`
      : "/default-avatar.png"; // <<< Đây là đường dẫn đến ảnh mặc định của bạn

  return (
    <img
      src={finalImageUrl}
      alt={user.nickname}
      className={`${className} rounded-full object-cover border-2 border-gray-600`}
    />
  );
};

export default Avatar;
