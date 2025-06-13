import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Avatar from '../components/common/Avatar';
import type { User } from '../types';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedCoverImage, setSelectedCoverImage] = useState<File | null>(null);
  const [previewCoverUrl, setPreviewCoverUrl] = useState<string | null>(null);

  // Messages for feedback
  const [avatarMessage, setAvatarMessage] = useState<string | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [bioMessage, setBioMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [coverMessage, setCoverMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetch('http://localhost:3000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) navigate('/login');
        else {
          setUser(data);
          setEmail(data.email || '');
          setBio(data.bio || '');
          setPreviewUrl(data.avatar_url);
          setPreviewCoverUrl(data.cover_photo_url);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setError('Không thể tải thông tin người dùng');
        setIsLoading(false);
      });
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAvatarMessage(null);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedCoverImage(file);
      setPreviewCoverUrl(URL.createObjectURL(file));
      setCoverMessage(null);
    }
  };

  const handleAvatarSave = async () => {
    const token = localStorage.getItem('token');
    if (!token || !selectedImage) return;

    setAvatarMessage('Đang tải lên...');
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('upload_preset', 'GameNexus');
      const uploadRes = await fetch('https://api.cloudinary.com/v1_1/dfsj2bcpi/image/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData.secure_url) {
        const newAvatarUrl = uploadData.secure_url;
        const res = await fetch('http://localhost:3000/api/users/update-avatar', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ avatar_url: newAvatarUrl }),
        });

        if (res.ok) {
          setUser(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null);
          setSelectedImage(null);
          setAvatarMessage('Cập nhật avatar thành công!');
        } else {
          setAvatarMessage('Không thể cập nhật avatar.');
        }
      } else {
        setAvatarMessage('Lỗi tải ảnh lên Cloudinary.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật avatar:', error);
      setAvatarMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleCoverPhotoSave = async () => {
    const token = localStorage.getItem('token');
    if (!token || !selectedCoverImage) return;

    setCoverMessage('Đang tải ảnh bìa lên...');
    try {
      const formData = new FormData();
      formData.append('file', selectedCoverImage);
      formData.append('upload_preset', 'GameNexus');
      const uploadRes = await fetch('https://api.cloudinary.com/v1_1/dfsj2bcpi/image/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (uploadData.secure_url) {
        const newCoverUrl = uploadData.secure_url;
        const res = await fetch('http://localhost:3000/api/users/update-cover-photo', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ cover_photo_url: newCoverUrl }),
        });

        if (res.ok) {
          setUser(prev => prev ? { ...prev, cover_photo_url: newCoverUrl } : null);
          setSelectedCoverImage(null);
          setCoverMessage('Cập nhật ảnh bìa thành công!');
        } else {
          setCoverMessage('Không thể cập nhật ảnh bìa.');
        }
      } else {
        setCoverMessage('Lỗi tải ảnh bìa lên Cloudinary.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật ảnh bìa:', error);
      setCoverMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleSaveEmail = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (email === (user?.email || '')) {
      setEmailMessage('Email không có thay đổi nào!');
      return;
    }

    setEmailMessage('Đang cập nhật email...');
    try {
      const res = await fetch('http://localhost:3000/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setUser(prev => prev ? { ...prev, email } : null);
        setEmailMessage('Cập nhật email thành công!');
      } else {
        setEmailMessage('Không thể cập nhật email. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật email:', error);
      setEmailMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleSaveBio = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (bio === (user?.bio || '')) {
      setBioMessage('Bio không có thay đổi nào!');
      return;
    }

    setBioMessage('Đang cập nhật bio...');
    try {
      const res = await fetch('http://localhost:3000/api/users/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ bio }),
      });

      if (res.ok) {
        setUser(prev => prev ? { ...prev, bio } : null);
        setBioMessage('Cập nhật bio thành công!');
      } else {
        setBioMessage('Không thể cập nhật bio. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật bio:', error);
      setBioMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage('Vui lòng điền đầy đủ các trường mật khẩu.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('Mật khẩu mới không khớp!');
      return;
    }

    setPasswordMessage('Đang thay đổi mật khẩu...');
    try {
      const passwordRes = await fetch('http://localhost:3000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      if (passwordRes.ok) {
        setPasswordMessage('Đổi mật khẩu thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errorData = await passwordRes.json();
        setPasswordMessage(errorData.message || 'Không thể thay đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.');
      }
    } catch (error) {
      console.error('Lỗi khi thay đổi mật khẩu:', error);
      setPasswordMessage('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div 
            className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 bg-cover bg-center relative group"
            style={{ backgroundImage: `url(${previewCoverUrl || user?.cover_photo_url || ''})` }}
          >
            {isEditing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
                <span className="text-white text-sm font-medium">Thay đổi ảnh bìa</span>
              </label>
            )}
            {selectedCoverImage && isEditing && (
              <button
                onClick={handleCoverPhotoSave}
                className="absolute bottom-2 right-2 px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors duration-200 shadow-md"
              >
                Lưu ảnh bìa
              </button>
            )}
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-12 space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative group">
                <Avatar
                  user={user || { id: 0, nickname: '', avatar_url: null }}
                  className="w-32 h-32 border-4 border-white shadow-lg rounded-full"
                  src={previewUrl || user?.avatar_url || '/default-avatar.png'}
                />
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <span className="text-white text-sm font-medium">Thay đổi ảnh</span>
                  </label>
                )}
                {selectedImage && isEditing && (
                  <button
                    onClick={handleAvatarSave}
                    className="absolute -bottom-2 -right-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs hover:bg-blue-700 transition-colors duration-200 shadow-md"
                  >
                    Lưu avatar
                  </button>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{user?.nickname}</h1>
                <p className="text-gray-500">ID: {user?.id}</p>
                {user?.points !== undefined && (
                  <div className="mt-2 inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <span className="mr-1">🏆</span>
                    {user.points} điểm
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                {isEditing ? 'Hoàn tất chỉnh sửa' : 'Chỉnh sửa hồ sơ'}
              </button>
            </div>
            {avatarMessage && <p className="text-center mt-4 text-sm font-medium">{avatarMessage}</p>}
            {coverMessage && <p className="text-center mt-2 text-sm font-medium">{coverMessage}</p>}
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {isEditing ? (
            <div className="space-y-8">
              {/* Email Section */}
              <div className="space-y-6 border-b pb-8 border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailMessage(null);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập email của bạn"
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleSaveEmail}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Lưu Email
                    </button>
                  </div>
                  {emailMessage && <p className="text-sm text-center mt-2 font-medium">{emailMessage}</p>}
                </div>

                {/* Bio Section */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới thiệu
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                      setBioMessage(null);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                    placeholder="Viết gì đó về bản thân..."
                  />
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleSaveBio}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Lưu Bio
                    </button>
                  </div>
                  {bioMessage && <p className="text-sm text-center mt-2 font-medium">{bioMessage}</p>}
                </div>
              </div>

              {/* Password Section */}
              <form onSubmit={handleChangePassword} className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Thay đổi mật khẩu</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Đổi mật khẩu
                  </button>
                </div>
                {passwordMessage && <p className="text-sm text-center mt-2 font-medium">{passwordMessage}</p>}
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Email Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-gray-900">{user?.email || 'Chưa cập nhật'}</p>
              </div>

              {/* Bio Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Giới thiệu</h3>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                  {user?.bio || 'Chưa có thông tin giới thiệu'}
                </p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-500">Bài viết</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-500">Bạn bè</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-500">Story</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">0</div>
                  <div className="text-sm text-gray-500">Điểm</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
