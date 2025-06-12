// src/components/icons/FriendsIcon.tsx
import React from 'react';

const FriendsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.289 2.72a9.094 9.094 0 0 1 3.741-.479 3 3 0 0 1-4.682-2.72m7.289 2.72-7.289-2.72m0 0a3 3 0 0 0-4.682 2.72 9.094 9.094 0 0 0 3.74.479m-12 1.844a2.25 2.25 0 0 1-2.244-2.077l.003-1.026a3 3 0 0 1 2.986-2.986l1.026.003a2.25 2.25 0 0 1 2.077 2.244l-1.026-.003a3 3 0 0 1-2.986 2.986Zm12-1.844a2.25 2.25 0 0 0 2.244-2.077l-.003-1.026a3 3 0 0 0-2.986-2.986l-1.026.003a2.25 2.25 0 0 0-2.077 2.244l1.026-.003a3 3 0 0 0 2.986 2.986Z" />
  </svg>
);

export default FriendsIcon;