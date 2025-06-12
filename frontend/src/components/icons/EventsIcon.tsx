// src/components/icons/EventsIcon.tsx
import React from 'react';
// Import icon Lịch từ bộ Font Awesome
import { FaCalendarAlt } from 'react-icons/fa';

const EventsIcon: React.FC<{ className?: string }> = ({ className }) => {
  return <FaCalendarAlt className={className} />;
};

export default EventsIcon;