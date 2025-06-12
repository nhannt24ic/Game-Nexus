// src/components/layout/LeftSidebar.tsx

import React, { useState, useEffect } from 'react';
import Avatar from '../common/Avatar';

// 1. Định nghĩa kiểu dữ liệu cho một người dùng trong danh sách top
interface TopUser {
  id: number;
  nickname: string;
  avatar_url: string | null;
  points: number;
}

const LeftSidebar: React.FC = () => {
  // 2. Tạo các state để lưu danh sách người dùng, trạng thái tải và lỗi
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Dùng useEffect để gọi API một lần khi component được render
  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("Không tìm thấy token xác thực.");
        }

        const response = await fetch('http://localhost:3000/api/users/top', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải bảng xếp hạng.');
        }

        const data: TopUser[] = await response.json();
        setTopUsers(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Một lỗi không mong muốn đã xảy ra.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTopUsers();
  }, []); // Mảng rỗng `[]` đảm bảo useEffect chỉ chạy 1 lần

  // 4. Render giao diện dựa trên các state
  return (
    <div className="bg-gray-800 p-4 rounded-lg sticky top-20">
      <h3 className="text-lg font-bold text-cyber-purple mb-4">Bảng Xếp Hạng</h3>
      
      {loading && <p className="text-gray-400">Đang tải...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <ul className="space-y-3">
          {topUsers.map((user, index) => (
            <li key={user.id} className="flex items-center space-x-3">
              <span className="font-bold text-gray-400 w-6">#{index + 1}</span>
              <Avatar user={user} className="w-10 h-10 border-2 border-gray-700" />
              <div className="flex-grow">
                <p className="font-semibold text-white">{user.nickname}</p>
                <p className="text-sm text-cyber-purple">{user.points} điểm</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeftSidebar;