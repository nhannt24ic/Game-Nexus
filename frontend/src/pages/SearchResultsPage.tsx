// src/pages/SearchResultsPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header'; // Tái sử dụng Header
import { type UserSearchResult } from '../types'; // Import kiểu dữ liệu
import UserSearchResultCard from '../components/search/UserSearchResultCard';

const SearchResultsPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || ''; // Lấy từ khóa từ URL

    const [results, setResults] = useState<UserSearchResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://localhost:3000/api/users/search?q=${query}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error("Lỗi khi tìm kiếm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]); // Chạy lại mỗi khi từ khóa tìm kiếm trong URL thay đổi

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <main className="container mx-auto pt-24 px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Kết quả tìm kiếm cho: <span className="text-purple-600">"{query}"</span>
                </h1>

                {loading ? (
                    <p>Đang tìm kiếm...</p>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map(user => (
                            <UserSearchResultCard key={user.id} user={user} />
                        ))}
                    </div>
                ) : (
                    <p>Không tìm thấy kết quả nào.</p>
                )}
            </main>
        </div>
    );
};

export default SearchResultsPage;