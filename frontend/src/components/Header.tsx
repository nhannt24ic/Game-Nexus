import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "./common/Avatar";

const Header: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setCurrentUser(data);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    // Chuyển hướng đến trang kết quả với từ khóa
    navigate(`/search?query=${searchQuery}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer group transition-all duration-300 relative"
            onClick={(e) => {
              const burst = e.currentTarget.querySelector(
                ".logo-burst"
              ) as HTMLElement;
              const logoRect = (
                e.currentTarget as HTMLElement
              ).getBoundingClientRect();
              // Lấy vị trí click tương đối với logo (bao gồm cả chữ)
              const x = e.clientX - logoRect.left;
              const y = e.clientY - logoRect.top;
              if (burst) {
                burst.style.left = `${x}px`;
                burst.style.top = `${y}px`;
                burst.classList.remove("burst-active");
                void burst.offsetWidth;
                burst.classList.add("burst-active");
              }
              // Chờ hiệu ứng burst xong mới chuyển trang nếu không ở trang chủ
              if (window.location.pathname !== "/") {
                setTimeout(() => navigate("/"), 400);
              }
            }}
            onMouseEnter={(e) => {
              const logo = e.currentTarget.querySelector(".modern-logo-anim");
              if (logo) logo.classList.add("animate-bounce");
            }}
            onMouseLeave={(e) => {
              const logo = e.currentTarget.querySelector(".modern-logo-anim");
              if (logo) logo.classList.remove("animate-bounce");
            }}
          >
            {/* New Modern Logo */}
            <div className="relative w-12 h-12 flex items-center justify-center modern-logo-anim animate-pulse transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              {/* Outer Glow + Gradient Shift */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 blur-lg opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-300 logo-gradient-anim"></div>
              {/* Main Logo Circle */}
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl border-2 border-white group-hover:shadow-2xl transition-all duration-300 logo-gradient-anim">
                {/* Controller Icon */}
                <svg
                  className="w-7 h-7 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="4"
                    y="8"
                    width="16"
                    height="8"
                    rx="4"
                    className="fill-white/80"
                  />
                  <circle cx="8.5" cy="12" r="1.2" className="fill-blue-500" />
                  <circle cx="15.5" cy="12" r="1.2" className="fill-pink-500" />
                  <rect
                    x="11"
                    y="10.5"
                    width="2"
                    height="3"
                    rx="1"
                    className="fill-purple-500"
                  />
                  <circle
                    cx="12"
                    cy="15.5"
                    r="0.7"
                    className="fill-yellow-400"
                  />
                </svg>
                {/* Decorative Dots */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent select-none group-hover:scale-105 transition-transform duration-300">
              GameNexus
            </h1>
            {/* Particle Burst */}
            <div
              className="logo-burst pointer-events-none absolute"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className={`burst-dot burst-dot-${i}`}></span>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm người chơi..."
                  className="w-full px-4 py-2 pl-10 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {/* Search Icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </form>
            </div>
          </div>

          {/* Right side group (Icons & Avatar) */}
          <div className="flex items-center space-x-4">
            {/* Navigation Icons */}
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
            {/* Avatar & Dropdown */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <Avatar
                    user={currentUser}
                    className="w-10 h-10 ring-2 ring-cyber-purple ring-offset-2 ring-offset-gray-900 transition-shadow"
                  />
                </button>
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse"></div>
              )}
              {isDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-white hover:bg-gray-800/80 rounded-lg"
                  >
                    Profile
                  </button>
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
      </div>
    </header>
  );
};

export default Header;
