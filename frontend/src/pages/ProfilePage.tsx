import React, { useEffect, useState, useRef } from 'react';
import Avatar from '../components/common/Avatar';
import type { User } from '../types';
import Header from '../components/Header';

// Bổ sung type User mở rộng cho email và bio
interface UserWithProfile extends User {
  email?: string;
  bio?: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

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
        setEmail(data.email || '');
        setBio(data.bio || '');
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg('');
    // Nếu không thay đổi gì thì không gửi request
    if (email === (user?.email || '') && bio === (user?.bio || '')) {
      setProfileMsg('Không có thay đổi nào!');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: email || user?.email || '',
          bio: bio || user?.bio || ''
        })
      });
      if (res.ok) {
        setProfileMsg('Cập nhật thành công!');
        setUser(prev => prev ? { ...prev, email, bio } : prev);
      } else setProfileMsg('Cập nhật thất bại!');
    } catch {
      setProfileMsg('Có lỗi xảy ra!');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg('');
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Mật khẩu mới không khớp!');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      if (res.ok) setPasswordMsg('Đổi mật khẩu thành công!');
      else setPasswordMsg('Đổi mật khẩu thất bại!');
    } catch {
      setPasswordMsg('Có lỗi xảy ra!');
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
      <div className="max-w-2xl mx-auto mt-24">
        {/* Card thông tin cá nhân */}
        <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col items-center mb-10">
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
        {/* Form cập nhật thông tin cá nhân */}
        <div className="w-full flex justify-center mb-8">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2"><span>👤</span>Thông tin cá nhân</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block font-medium mb-1">Bio</label>
                <textarea className="w-full border rounded px-3 py-2" value={bio} onChange={e => setBio(e.target.value)} />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Lưu thay đổi</button>
              {profileMsg && <div className="text-center text-sm mt-2 text-green-600">{profileMsg}</div>}
            </form>
          </div>
        </div>
        {/* Form đổi mật khẩu */}
        <div className="w-full flex justify-center">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2"><span>🔒</span>Đổi mật khẩu</h3>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block font-medium mb-1">Mật khẩu cũ</label>
                <input type="password" className="w-full border rounded px-3 py-2" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
              </div>
              <div>
                <label className="block font-medium mb-1">Mật khẩu mới</label>
                <input type="password" className="w-full border rounded px-3 py-2" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div>
                <label className="block font-medium mb-1">Xác nhận mật khẩu mới</label>
                <input type="password" className="w-full border rounded px-3 py-2" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Đổi mật khẩu</button>
              {passwordMsg && <div className="text-center text-sm mt-2 text-green-600">{passwordMsg}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 