// src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeIcon from './icons/HomeIcon'; // Import icon component
import FriendsIcon from './icons/FriendsIcon';
import EventsIcon from './icons/EventsIcon';
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
    <header className="bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          
          {/* Phần bên trái: Logo và Search */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-cyber-purple">
              GN
            </Link>
            <div className="relative">
              {/* Chức năng tìm kiếm sẽ được làm sau */}
              <input 
                type="text" 
                placeholder="Tìm kiếm Game Nexus..."
                className="bg-gray-700 text-white rounded-full pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-cyber-purple"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                 {/* Search Icon SVG can go here */}
              </div>
            </div>
          </div>

          {/* Phần giữa: Navigation Icons */}
          {/* Phần giữa: Navigation Icons */}
            <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-cyber-purple transition-colors p-2 rounded-lg">
                <HomeIcon className="w-7 h-7" />
            </Link>
            <Link to="/friends" className="text-gray-300 hover:text-cyber-purple transition-colors p-2 rounded-lg">
                <FriendsIcon className="w-7 h-7" />
            </Link>
            <Link to="/events" className="text-gray-300 hover:text-cyber-purple transition-colors p-2 rounded-lg">
                <EventsIcon className="w-7 h-7" />
            </Link>
            </nav>

          {/* Phần bên phải: Avatar và Dropdown */}
          <div className="relative">
            {currentUser ? (
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2">
                <Avatar user={currentUser} className="w-10 h-10" />
              </button>
            ) : (
              <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
            )}
            
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg py-1"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-gray-700">
                  <p className="font-semibold text-white">{currentUser?.nickname}</p>
                </div>
                <Link 
                  to={`/profile/${currentUser?.id}`} // Link đến trang cá nhân (sẽ làm sau)
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Trang cá nhân
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
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