// src/controllers/friendController.ts
import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import db from '../config/db';
import { RowDataPacket } from 'mysql2';

export const getFriends = async (req: Request, res: Response): Promise<void> => {
    const userId = (req.user as JwtPayload).id;
    try {
        const [friends] = await db.query<RowDataPacket[]>(`
            SELECT u.id, u.nickname, u.avatar_url
            FROM friendships f
            JOIN users u ON 
                (CASE WHEN f.user_one_id = ? THEN f.user_two_id ELSE f.user_one_id END) = u.id
            WHERE (f.user_one_id = ? OR f.user_two_id = ?) AND f.status = 'accepted'
        `, [userId, userId, userId]);
        res.status(200).json(friends);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bạn bè:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
};