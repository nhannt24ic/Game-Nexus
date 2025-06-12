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
    <div className="bg-gray-900/90 p-5 rounded-2xl shadow-xl border border-gray-800 space-y-8">
      {/* Danh sách bạn bè */}
      <div>
        <h3 className="text-xl font-extrabold text-cyber-purple mb-5 tracking-tight">Bạn bè</h3>
        {loading && <p className="text-gray-400">Đang tải...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <ul className="space-y-4">
            {friends.length > 0 ? (
              friends.map(friend => (
                <li key={friend.id} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-800/70 transition-all group">
                  <div className="relative">
                    <Avatar user={friend} className="w-11 h-11 border-2 border-cyber-purple group-hover:ring-2 group-hover:ring-cyber-blue transition-all" />
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-gray-900"></span>
                  </div>
                  <span className="font-semibold text-white group-hover:text-cyber-purple transition-colors">{friend.nickname}</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400 text-sm">Bạn chưa có người bạn nào.</p>
            )}
          </ul>
        )}
      </div>
      {/* Nhóm */}
      <div>
        <h3 className="text-xl font-extrabold text-cyber-purple mb-5 tracking-tight flex items-center gap-2">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z"/></svg>
          Nhóm của bạn
        </h3>
        <p className="text-gray-400 text-sm">Tính năng đang được phát triển.</p>
      </div>
    </div>
  );
};

export default RightSidebar;