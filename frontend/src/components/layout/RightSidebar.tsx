// src/components/layout/RightSidebar.tsx

import React, { useState, useEffect } from 'react';
import Avatar from '../common/Avatar';
// 1. Định nghĩa kiểu dữ liệu cho một người bạn
interface Friend {
  id: number;
  nickname: string;
  avatar_url: string | null;
}

const RightSidebar: React.FC = () => {
  // 2. Tạo các state cho danh sách bạn bè, trạng thái tải và lỗi
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Dùng useEffect để gọi API
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("Không tìm thấy token xác thực.");

        const response = await fetch('http://localhost:3000/api/friends', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải danh sách bạn bè.');
        }

        const data: Friend[] = await response.json();
        setFriends(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded-lg sticky top-20 space-y-6">
      {/* Phần danh sách bạn bè */}
      <div>
        <h3 className="text-lg font-bold text-cyber-purple mb-4">Bạn bè</h3>
        {loading && <p className="text-gray-400">Đang tải...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <ul className="space-y-4">
            {friends.length > 0 ? (
              friends.map(friend => (
                <li key={friend.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar user={friend} className="w-10 h-10 border-2 border-gray-700" />
                    {/* Chấm xanh trạng thái online (tạm thời để tĩnh) */}
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></span>
                  </div>
                  <span className="font-semibold text-white">{friend.nickname}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 text-sm">Bạn chưa có người bạn nào.</p>
            )}
          </ul>
        )}
      </div>

      {/* Phần Nhóm (placeholder) */}
      <div>
        <h3 className="text-lg font-bold text-cyber-purple mb-4">Nhóm của bạn</h3>
        <p className="text-gray-400 text-sm">Tính năng đang được phát triển.</p>
      </div>
    </div>
  );
};

export default RightSidebar;