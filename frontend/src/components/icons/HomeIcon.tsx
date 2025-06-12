// src/components/icons/HomeIcon.tsx
import React from 'react';
// Import icon Home từ bộ Font Awesome của react-icons
import { FaHome } from 'react-icons/fa';

const HomeIcon: React.FC<{ className?: string }> = ({ className }) => {
  return <FaHome className={className} />;
};

export default HomeIcon;