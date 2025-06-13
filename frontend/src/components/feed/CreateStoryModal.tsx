import React, { useState, useRef, useEffect } from 'react';
import Avatar from '../common/Avatar';
import GameSelector from './GameSelector'; // Dùng lại GameSelector nếu có
import type { User } from '../../types';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated?: () => void; // Callback khi story được tạo thành công
}

const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose, onStoryCreated }) => {
  const [storyContent, setStoryContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedGame, setSelectedGame] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ nickname: string; avatar_url: string | null } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch user info khi modal mở
  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('http://localhost:3000/api/users/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setUser({ nickname: data.nickname, avatar_url: data.avatar_url });
      });
  }, [isOpen]);

  // Hàm upload 1 file lên Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'GameNexus'); // THAY BẰNG UPLOAD_PRESET CỦA BẠN
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dfsj2bcpi/image/upload', { // THAY BẰNG YOUR_CLOUD_NAME
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      console.error('Lỗi upload ảnh lên Cloudinary:', error);
      throw new Error('Không thể upload ảnh lên Cloudinary.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input file
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyContent.trim() && !selectedImage) return;

    setIsLoading(true);
    let imageUrl = null;

    try {
      if (selectedImage) {
        imageUrl = await uploadToCloudinary(selectedImage);
      }

      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: storyContent,
          imageUrl: imageUrl, // Gửi URL Cloudinary
          game: selectedGame,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Đăng story thất bại!');
      }

      // Reset form và đóng modal
      setStoryContent('');
      setSelectedImage(null);
      setSelectedGame('');
      setIsLoading(false);
      if (onStoryCreated) onStoryCreated();
      onClose();
    } catch (error) {
      console.error('Lỗi khi đăng story:', error);
      alert(error instanceof Error ? error.message : 'Đăng story thất bại!');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Tạo Story mới</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-3">
            {user ? (
              <Avatar user={{ id: user.nickname, nickname: user.nickname, avatar_url: user.avatar_url }} className="w-12 h-12 border-2 border-cyber-purple" />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">?</span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{user ? user.nickname : '...'}</h3>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          {/* Content Area */}
          <div className="px-6 flex-grow overflow-y-auto">
            <textarea
              value={storyContent}
              onChange={(e) => setStoryContent(e.target.value)}
              placeholder="Bạn đang nghĩ gì? Chia sẻ câu chuyện của bạn..."
              className="w-full h-24 resize-none border-0 text-lg placeholder-gray-500 focus:outline-none"
              maxLength={200}
            />

            {/* Image Preview */}
            {selectedImage && (
              <div className="relative mt-4 mb-4">
                <img src={URL.createObjectURL(selectedImage)} alt="Selected story" className="w-full h-48 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            {/* Game Selector */}
            {selectedGame && (
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🎮</span>
                    <span className="font-medium text-blue-800">Chơi {selectedGame}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedGame('')}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="text-xl">📸</span>
                <span className="font-medium">Ảnh</span>
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />

              <button
                type="button"
                onClick={() => setSelectedGame(selectedGame ? '' : 'Chọn Game')} // Logic đơn giản để mở/đóng game selector
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <span className="text-xl">🎮</span>
                <span className="font-medium">Game</span>
              </button>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-5 rounded-full hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              disabled={isLoading || (!storyContent.trim() && !selectedImage)}
            >
              {isLoading ? 'Đang đăng...' : 'Đăng Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStoryModal; 