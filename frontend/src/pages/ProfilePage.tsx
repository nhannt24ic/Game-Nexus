import React, { useEffect, useState, useRef } from 'react';
import Avatar from '../components/common/Avatar';
import type { User } from '../types';
import Header from '../components/Header';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    fetch('http://localhost:3000/api/users/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    // Upload lên Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'GameNexus'); // Thay bằng upload_preset của bạn
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dfsj2bcpi/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.secure_url) {
        // Gọi API backend để cập nhật avatar_url
        const token = localStorage.getItem('token');
        await fetch('http://localhost:3000/api/users/update-avatar', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ avatar_url: data.secure_url })
        });
        setUser(prev => prev ? { ...prev, avatar_url: data.secure_url } : prev);
      }
    } catch (err) {
      alert('Lỗi upload ảnh!');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">Bạn cần đăng nhập để xem profile.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="max-w-xl mx-auto mt-24 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar user={user} className="w-24 h-24 mb-4" />
            <button
              className="absolute bottom-2 right-2 bg-blue-600 text-white rounded-full p-2 shadow hover:bg-blue-700 transition text-xs"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Thay đổi avatar"
            >
              {uploading ? '...' : '🖼️'}
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleAvatarChange}
              disabled={uploading}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.nickname}</h2>
          <p className="text-gray-500 mb-2">ID: {user.id}</p>
          {user.points !== undefined && (
            <p className="text-blue-600 font-semibold mb-2">Points: {user.points}</p>
          )}
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">Chỉnh sửa hồ sơ</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 