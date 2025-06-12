// src/controllers/postController.ts
import { Request, Response } from 'express';
import db from '../config/db';
import { JwtPayload } from 'jsonwebtoken';

export const createPost = async (req: Request, res: Response): Promise<void> => {
    // Lấy userId từ req.user (đã được middleware xác thực và gắn vào)
    const userId = (req.user as JwtPayload).id;

    // Lấy nội dung và tags từ body của request
    const { content, tags } = req.body; // tags là một mảng các chuỗi, ví dụ: ["news", "update"]

    if (!content) {
        res.status(400).json({ message: 'Nội dung bài viết không được để trống.' });
        return;
    }

    const connection = await db.getConnection(); // Lấy một kết nối từ pool

    try {
        // 1. Bắt đầu một transaction
        await connection.beginTransaction();

        // 2. Thêm bài viết vào bảng `posts`
        // Tạm thời để status là 'approved' như yêu cầu
        const [postResult] = await connection.query<any>(
            'INSERT INTO posts (user_id, content, status) VALUES (?, ?, ?)',
            [userId, content, 'approved'] 
        );
        const postId = postResult.insertId;

        // 3. Xử lý các tags (nếu có)
        if (tags && Array.isArray(tags) && tags.length > 0) {
            for (const tagName of tags) {
                // 3a. Kiểm tra xem tag đã tồn tại chưa
                let [existingTags] = await connection.query<any>(
                    'SELECT id FROM tags WHERE name = ?',
                    [tagName]
                );

                let tagId;
                if (existingTags.length === 0) {
                    // 3b. Nếu tag chưa tồn tại, tạo tag mới
                    const [newTagResult] = await connection.query<any>(
                        'INSERT INTO tags (name) VALUES (?)',
                        [tagName]
                    );
                    tagId = newTagResult.insertId;
                } else {
                    // 3c. Nếu tag đã tồn tại, lấy id của nó
                    tagId = existingTags[0].id;
                }

                // 3d. Liên kết bài viết với tag trong bảng `post_tags`
                await connection.query(
                    'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)',
                    [postId, tagId]
                );
            }
        }

        // 4. Nếu tất cả các bước trên thành công, commit transaction
        await connection.commit();

        res.status(201).json({ 
            message: 'Đăng bài thành công!',
            postId: postId 
        });

    } catch (error) {
        // 5. Nếu có bất kỳ lỗi nào xảy ra, rollback transaction
        await connection.rollback();
        console.error('Lỗi khi tạo bài viết:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra trên máy chủ.' });
    } finally {
        // 6. Luôn luôn trả kết nối về pool sau khi xong việc
        connection.release();
    }
};