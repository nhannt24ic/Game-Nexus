// src/components/icons/ContactIcon.tsx
import React from 'react';
// Import icon Email từ bộ Material Design (md) của thư viện react-icons
import { MdEmail } from 'react-icons/md';

const ContactIcon: React.FC<{ className?: string }> = ({ className }) => {
  return <MdEmail className={className} />;
};

export default ContactIcon;