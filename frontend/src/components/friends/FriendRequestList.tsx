// src/components/friends/FriendRequestList.tsx
import React, { useState, useEffect } from "react";
import { type IncomingRequest } from "../../types"; // Sẽ tạo type này ở bước sau
import Avatar from "../common/Avatar";
import { useNotifier } from "../../context/NotificationContext";

const FriendRequestList: React.FC = () => {
  const [requests, setRequests] = useState<IncomingRequest[]>([]);
  const addNotification = useNotifier();

  useEffect(() => {
    // Logic fetch các lời mời đã nhận
  }, []);

  const handleResponse = async (
    friendshipId: number,
    action: "accept" | "decline"
  ) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/api/friends/requests/${friendshipId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      addNotification(data.message, "success");
      // Xóa lời mời đã xử lý khỏi danh sách trên UI
      setRequests((prev) => prev.filter((req) => req.id !== friendshipId));
    } catch (err) {
      // Sửa lại khối catch
      if (err instanceof Error) {
        addNotification(err.message, "error");
      } else {
        addNotification("Một lỗi không mong muốn đã xảy ra.", "error");
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg mb-4">Lời mời kết bạn</h3>
      <div className="space-y-4">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div key={req.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar
                  user={{
                    id: req.sender_id,
                    nickname: req.nickname,
                    avatar_url: req.avatar_url,
                  }}
                  className="w-12 h-12"
                />
                <p className="ml-4 font-bold text-gray-800">{req.nickname}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleResponse(req.id, "accept")}
                  className="px-4 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Đồng ý
                </button>
                <button
                  onClick={() => handleResponse(req.id, "decline")}
                  className="px-4 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Không có lời mời kết bạn nào.</p>
        )}
      </div>
    </div>
  );
};
export default FriendRequestList;
