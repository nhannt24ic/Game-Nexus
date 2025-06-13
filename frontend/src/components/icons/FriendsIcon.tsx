// src/components/icons/FriendsIcon.tsx

import React from "react";
// 1. Import một icon cụ thể từ thư viện react-icons
// Ví dụ này dùng icon từ bộ Font Awesome (Fa)
import { FaUserFriends } from "react-icons/fa";

// 2. Component giờ chỉ cần trả về icon đã import
const FriendsIcon: React.FC<{ className?: string }> = ({ className }) => {
  // Chúng ta vẫn truyền className vào để có thể tùy chỉnh kích thước và màu sắc từ bên ngoài
  return <FaUserFriends className={className} />;
};

export default FriendsIcon;
