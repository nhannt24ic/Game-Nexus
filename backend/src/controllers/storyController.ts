import { Request, Response } from 'express';
import db from '../config/db';
import { JwtPayload } from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

// API để tạo một story mới
export const createStory = async (req: Request, res: Response): Promise<void> => {
  const userId = (req.user as JwtPayload).id; // Lấy userId từ token
  const { content, imageUrl, game } = req.body;

  if (!content && !imageUrl) {
    res.status(400).json({ message: 'Story phải có nội dung hoặc hình ảnh.' });
    return;
  }

  try {
    await db.query(
      "INSERT INTO stories (user_id, content, image_url, game) VALUES (?, ?, ?, ?)",
      [userId, content || null, imageUrl || null, game || null]
    );
    res.status(201).json({ message: 'Story đã được đăng thành công!' });
  } catch (error) {
    console.error('Lỗi khi tạo story:', error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra trên máy chủ.' });
  }
};

// API để lấy tất cả story còn hiệu lực (trong 24 giờ)
export const getActiveStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const [stories] = await db.query<RowDataPacket[]>(`
      SELECT 
        s.id, 
        s.user_id, 
        s.content, 
        s.image_url, 
        s.game, 
        s.created_at,
        u.nickname,
        u.avatar_url
      FROM stories s
      JOIN users u ON s.user_id = u.id
      WHERE s.created_at >= NOW() - INTERVAL 24 HOUR
      ORDER BY s.created_at DESC
    `);
    res.status(200).json(stories);
  } catch (error) {
    console.error('Lỗi khi lấy stories:', error);
    res.status(500).json({ message: 'Đã có lỗi xảy ra trên máy chủ.' });
  }
}; 