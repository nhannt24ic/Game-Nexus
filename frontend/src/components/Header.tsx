// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from './icons/HomeIcon'; // Import icon component
import FriendsIcon from './icons/FriendsIcon';
import EventsIcon from './icons/EventsIcon';
import ContactIcon from './icons/ContactIcon';
import Avatar from './common/Avatar';

// Định nghĩa kiểu dữ liệu cho người dùng
interface CurrentUser {
  id: number;
  nickname: string;
  avatar_url: string | null;
}

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Lấy thông tin người dùng khi component được mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:3000/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data: CurrentUser = await response.json();
          setCurrentUser(data);
        }
      } catch (error) {
        console.error("Không thể lấy thông tin người dùng:", error);
      }
    };
    fetchCurrentUser();
  }, []);
  
  // Xử lý đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-gray-900/90 shadow-xl fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 relative">
          {/* Logo và Search */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-3xl font-extrabold text-cyber-purple tracking-tight drop-shadow-lg hover:scale-105 transition-transform duration-200">
              <span className="bg-gradient-to-r from-cyber-purple to-cyber-blue bg-clip-text text-transparent">GN</span>
            </Link>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm"
                className="bg-gray-800/80 text-white rounded-full pl-10 pr-4 py-2 w-56 md:w-64 focus:outline-none focus:ring-2 focus:ring-cyber-purple border border-gray-700 shadow-inner"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-purple">
                {/* Search Icon */}
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"/></svg>
              </div>
            </div>
          </div>
          {/* Navigation Icons - căn giữa tuyệt đối */}
          <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center space-x-10">
            <Link to="/" className="text-gray-300 hover:text-cyber-purple transition-colors p-2 flex items-center justify-center">
              <HomeIcon className="w-7 h-7" />
            </Link>
            <Link to="/friends" className="text-gray-300 hover:text-cyber-purple transition-colors p-2 flex items-center justify-center">
              <FriendsIcon className="w-7 h-7" />
            </Link>
            <Link to="/events" className="text-gray-300 hover:text-cyber-purple transition-colors p-2 flex items-center justify-center">
              <EventsIcon className="w-7 h-7" />
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-cyber-purple transition-colors p-2 flex items-center justify-center">
              <ContactIcon className="w-7 h-7" />
            </Link>
          </nav>
          {/* Avatar & Dropdown */}
          <div className="relative">
            {currentUser ? (
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 focus:outline-none">
                <Avatar user={currentUser} className="w-10 h-10 ring-2 ring-cyber-purple ring-offset-2 ring-offset-gray-900 transition-shadow" />
              </button>
            ) : (
              <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
            )}
            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-gray-800">
                  <p className="font-semibold text-white">{currentUser?.nickname}</p>
                </div>
                <Link 
                  to={`/profile/${currentUser?.id}`}
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/80 rounded-lg"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Trang cá nhân
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-gray-800/80 rounded-lg"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;