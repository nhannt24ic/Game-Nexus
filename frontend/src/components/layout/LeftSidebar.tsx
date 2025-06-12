// src/components/layout/LeftSidebar.tsx

import React, { useEffect, useState } from 'react';
import HomeIcon from '../icons/HomeIcon';
import FriendsIcon from '../icons/FriendsIcon';
import EventsIcon from '../icons/EventsIcon';
import ContactIcon from '../icons/ContactIcon';
import Avatar from '../common/Avatar';

const LeftSidebar: React.FC = () => {
  const [user, setUser] = useState<{nickname: string, avatar_url: string|null} | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:3000/api/users/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setUser({ nickname: data.nickname, avatar_url: data.avatar_url });
      });
  }, []);

  const menuItems = [
    { icon: HomeIcon, label: 'Home', active: true },
    { icon: FriendsIcon, label: 'Friends', count: 12 },
    { icon: EventsIcon, label: 'Events', count: 3 },
    { icon: ContactIcon, label: 'Messages', count: 5 },
  ];

  const shortcuts = [
    { name: 'Gaming Squad', avatar: '🎮', online: true },
    { name: 'Esports Team', avatar: '🏆', online: false },
    { name: 'Casual Gamers', avatar: '🎯', online: true },
    { name: 'Streamers Hub', avatar: '📺', online: true },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-3">
          <Avatar user={{ id: 0, nickname: user ? user.nickname : '...', avatar_url: user ? user.avatar_url : null }} className="w-12 h-12 border-2 border-cyber-purple" />
          <div>
            <h3 className="font-semibold text-gray-900">{user ? user.nickname : '...'}</h3>
            <p className="text-sm text-gray-500">Level 42 Gamer</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-900">1.2K</div>
            <div className="text-gray-500">Friends</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">89</div>
            <div className="text-gray-500">Games</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-900">456</div>
            <div className="text-gray-500">Hours</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Menu</h3>
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 ${
                  item.active
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {item.count}
                  </span>
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Shortcuts */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Your Groups</h3>
          <div className="space-y-3">
            {shortcuts.map((group, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <div className="relative">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm">{group.avatar}</span>
                  </div>
                  {group.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{group.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;