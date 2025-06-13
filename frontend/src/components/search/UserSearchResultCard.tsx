// src/components/search/UserSearchResultCard.tsx
import React from 'react';
import Avatar from '../common/Avatar';
import { type UserSearchResult } from '../../types';
import { jwtDecode } from 'jwt-decode';

interface UserCardProps {
    user: UserSearchResult;
    onAction: (targetUserId: number, friendshipId: number | null, action: 'add' | 'cancel' | 'accept' | 'decline') => void;
}

const getCurrentUserId = (): number | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const decoded: { id: number } = jwtDecode(token);
        return decoded.id;
    } catch (error) {
        return null;
    }
};

const UserSearchResultCard: React.FC<UserCardProps> = ({ user, onAction }) => {
    const currentUserId = getCurrentUserId();

    const renderFriendshipButton = () => {
        const { id, friendship_id, friendship_status, action_user_id } = user;

        if (friendship_status === 'accepted') {
            return <span className="text-sm text-green-500 font-semibold">Bạn bè</span>;
        }

        if (friendship_status === 'pending') {
            if (action_user_id === currentUserId) {
                // Mình là người gửi lời mời -> Nút Hủy
                return <button onClick={() => onAction(id, null, 'cancel')} className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full hover:bg-red-600">Hủy lời mời</button>;
            } else {
                // Mình là người nhận lời mời -> Nút Đồng ý/Từ chối
                return (
                    <div className="flex space-x-2">
                        <button onClick={() => onAction(id, friendship_id, 'accept')} className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full hover:bg-blue-600">Đồng ý</button>
                        <button onClick={() => onAction(id, friendship_id, 'decline')} className="px-3 py-1 bg-gray-300 text-xs font-semibold rounded-full hover:bg-gray-400">Từ chối</button>
                    </div>
                );
            }
        }
        
        // Mặc định, nếu không có quan hệ gì -> Nút Kết bạn
        return <button onClick={() => onAction(id, null, 'add')} className="px-4 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full hover:bg-purple-700">Kết bạn</button>;
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center">
                <Avatar user={{ id: user.id, nickname: user.nickname, avatar_url: user.avatar_url }} className="w-12 h-12" />
                <p className="ml-4 font-bold text-gray-800">{user.nickname}</p>
            </div>
            <div>
                {renderFriendshipButton()}
            </div>
        </div>
    );
};

export default UserSearchResultCard;