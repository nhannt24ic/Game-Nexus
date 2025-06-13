// src/pages/SearchResultsPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import { type UserSearchResult } from '../types';
import UserSearchResultCard from '../components/search/UserSearchResultCard';
import { useNotifier } from '../context/NotificationContext';

const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    
    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(true);
    const addNotification = useNotifier();

    // Hàm gọi API được đặt trong useCallback để không bị tạo lại mỗi lần render
    const fetchResults = useCallback(async () => {
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:3000/api/users/search?q=${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if(!response.ok) throw new Error(data.message || "Lỗi tìm kiếm");
            setResults(data);
        } catch (err) {
            if (err instanceof Error) {
                addNotification(err.message, 'error');
            } else {
                addNotification('Lỗi không xác định khi tìm kiếm.', 'error');
            }
        } finally {
            setLoading(false);
        }
    }, [query, addNotification]); // Thêm addNotification vào dependency array

    // useEffect để chạy hàm fetchResults khi query thay đổi
    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    // Hàm xử lý tất cả các hành động liên quan đến bạn bè
    const handleFriendAction = async (targetUserId: number, friendshipId: number | null, action: 'add' | 'cancel' | 'accept' | 'decline') => {
        const token = localStorage.getItem('token');
        if (!token) {
            addNotification('Vui lòng đăng nhập.', 'error');
            return;
        }

        let url = '';
        let method = 'POST';
        let body: any = null;

        switch (action) {
            case 'add':
                url = `http://localhost:3000/api/friends/request/${targetUserId}`;
                method = 'POST';
                break;
            case 'cancel':
                url = `http://localhost:3000/api/friends/request/sent/${targetUserId}`;
                method = 'DELETE';
                break;
            case 'accept':
            case 'decline':
                if(!friendshipId) return;
                url = `http://localhost:3000/api/friends/requests/${friendshipId}`;
                method = 'PUT';
                body = JSON.stringify({ action });
                break;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            
            addNotification(data.message, 'success');
            // Tải lại kết quả để cập nhật trạng thái các nút bấm ngay lập tức
            fetchResults();
        } catch (err) {
            if (err instanceof Error) addNotification(err.message, 'error');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <main className="container mx-auto pt-24 px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Kết quả tìm kiếm cho: <span className="text-purple-600">"{query}"</span>
                </h1>
                
                {loading ? (
                    <p className="text-gray-500">Đang tìm kiếm...</p>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map(user => (
                            <UserSearchResultCard 
                                key={user.id} 
                                user={user}
                                onAction={handleFriendAction}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Không tìm thấy kết quả nào phù hợp.</p>
                )}
            </main>
        </div>
    );
};

export default SearchResultsPage;