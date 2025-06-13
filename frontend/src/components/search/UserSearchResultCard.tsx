// src/components/search/UserSearchResultCard.tsx
import React from "react";
import Avatar from "../common/Avatar";
import { type UserSearchResult } from "../../types";
import { useNotifier } from "../../context/NotificationContext";

interface UserCardProps {
  user: UserSearchResult;
}

const UserSearchResultCard: React.FC<UserCardProps> = ({ user }) => {
  const addNotification = useNotifier();

  const handleAddFriend = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3000/api/friends/request/${user.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        // Ném ra một Error với message từ API
        throw new Error(data.message || "Hành động thất bại");
      }
      addNotification("Đã gửi lời mời kết bạn!", "success");
      // TODO: Cập nhật trạng thái của nút bấm sau khi gửi thành công
    } catch (err) {
      // --- SỬA LỖI Ở ĐÂY ---
      // Kiểm tra kiểu của lỗi trước khi sử dụng
      if (err instanceof Error) {
        addNotification(err.message, "error");
      } else {
        addNotification("Một lỗi không mong muốn đã xảy ra.", "error");
      }
    }
  };

  const renderFriendshipButton = () => {
    switch (user.friendship_status) {
      case "accepted":
        return (
          <span className="text-sm text-green-500 font-semibold">Bạn bè</span>
        );
      case "pending":
        return (
          <span className="text-sm text-yellow-500 font-semibold">
            Đang chờ
          </span>
        );
      default:
        return (
          <button
            onClick={handleAddFriend}
            className="px-4 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full hover:bg-purple-700 transition"
          >
            Kết bạn
          </button>
        );
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
      <div className="flex items-center">
        <Avatar
          user={{
            id: user.id,
            nickname: user.nickname,
            avatar_url: user.avatar_url,
          }}
          className="w-12 h-12"
        />
        <p className="ml-4 font-bold text-gray-800">{user.nickname}</p>
      </div>
      {renderFriendshipButton()}
    </div>
  );
};

export default UserSearchResultCard;
