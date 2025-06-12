// src/pages/AuthPage.tsx
import React, { useState, useEffect } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const backgroundImages = [
  '/backgrounds/bg1.jpg',
  '/backgrounds/bg2.jpg',
  '/backgrounds/bg3.jpg',
];

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 7000); // Chuyển ảnh mỗi 7 giây

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center transition-all duration-1000 ease-in-out"
      style={{ backgroundImage: `url(${backgroundImages[currentBgIndex]})` }}
    >
      {/* Lớp phủ màu đen mờ */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      
      {/* Container chính */}
      <div className="w-full max-w-4xl flex rounded-lg shadow-2xl overflow-hidden z-10 mx-4">
        {/* Phần bên trái - Giới thiệu */}
        <div className="w-1/2 p-12 text-white hidden md:flex flex-col justify-center bg-black bg-opacity-20 backdrop-blur-md">
          <h1 className="text-5xl font-bold text-cyber-purple drop-shadow-lg">Game Nexus</h1>
          <p className="mt-4 text-gray-200 text-lg">
            Kết nối cộng đồng. Chia sẻ khoảnh khắc, tìm đồng đội và cập nhật tin tức mới nhất về game của bạn.
          </p>
        </div>

        {/* Phần bên phải - Form */}
        <div className="w-full md:w-1/2 p-8 bg-gray-900 bg-opacity-90">
          {isLoginView ? (
            <LoginForm switchToRegister={() => setIsLoginView(false)} />
          ) : (
            <RegisterForm switchToLogin={() => setIsLoginView(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;