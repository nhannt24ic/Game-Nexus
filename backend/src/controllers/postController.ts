// src/controllers/postController.ts
import { Request, Response } from 'express';
import db from '../config/db';
import { JwtPayload } from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

export const createPost = async (req: Request, res: Response): Promise<void> => {
    const userId = (req.user as JwtPayload).id;
    const { content, tags } = req.body;

    // Multer sẽ cung cấp một mảng các file trong `req.files`
    const files = req.files as Express.Multer.File[];

    if (!content && (!files || files.length === 0)) {
        res.status(400).json({ message: 'Bài viết phải có nội dung hoặc ít nhất một hình ảnh.' });
        return;
    }

    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Thêm bài viết vào bảng `posts` (không còn cột image_url)
        const [postResult] = await connection.query<any>(
            'INSERT INTO posts (user_id, content, status) VALUES (?, ?, ?)',
            [userId, content || null, 'approved']
        );
        const postId = postResult.insertId;

        // 2. Xử lý các tags (logic này giữ nguyên)
        if (tags && Array.isArray(tags) && tags.length > 0) {
            for (const tagName of tags) {
                let [existingTags] = await connection.query<any>('SELECT id FROM tags WHERE name = ?', [tagName]);
                let tagId;
                if (existingTags.length === 0) {
                    const [newTagResult] = await connection.query<any>('INSERT INTO tags (name) VALUES (?)', [tagName]);
                    tagId = newTagResult.insertId;
                } else {
                    tagId = existingTags[0].id;
                }
                await connection.query('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagId]);
            }
        }

        // 3. Xử lý nhiều file ảnh (logic mới)
        const imageUrls: string[] = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const imageUrl = `/uploads/posts/${file.filename}`;
                imageUrls.push(imageUrl);

                // Thêm đường dẫn ảnh vào bảng `post_images` mới
                await connection.query(
                    'INSERT INTO post_images (post_id, image_url) VALUES (?, ?)',
                    [postId, imageUrl]
                );
            }
        }

        // 4. Commit transaction
        await connection.commit();

        res.status(201).json({
            message: 'Đăng bài thành công!',
            postId: postId,
            imageUrls: imageUrls // Trả về một mảng các đường dẫn ảnh
        });

    } catch (error) {
        await connection.rollback();
        console.error('Lỗi khi tạo bài viết:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra trên máy chủ.' });
    } finally {
        connection.release();
    }
};

export const toggleLikePost = async (req: Request, res: Response): Promise<void> => {
    // Lấy id của người dùng đang thực hiện hành động (đã đăng nhập)
    const userId = (req.user as JwtPayload).id;
    // Lấy id của bài viết từ URL, ví dụ: /api/posts/5/like
    const postId = parseInt(req.params.postId, 10);

    if (isNaN(postId)) {
        res.status(400).json({ message: 'Post ID không hợp lệ.'});
        return;
    }

    const connection = await db.getConnection();

    try {
        // Bắt đầu một transaction
        await connection.beginTransaction();

        // 1. Kiểm tra xem bài viết có tồn tại, đã được duyệt và lấy ID của tác giả không
        const [posts] = await connection.query<any>(
            'SELECT user_id FROM posts WHERE id = ? AND status = ?',
            [postId, 'approved']
        );

        if (posts.length === 0) {
            res.status(404).json({ message: 'Bài viết không tồn tại hoặc chưa được duyệt.' });
            await connection.rollback(); // Hoàn tác transaction
            return;
        }

        const authorId = posts[0].user_id;

        // Ngăn người dùng tự "thích" bài viết của chính mình để tránh farm điểm
        if (userId === authorId) {
            res.status(403).json({ message: 'Bạn không thể thích bài viết của chính mình.' });
            await connection.rollback();
            return;
        }

        // 2. Kiểm tra xem người dùng này đã "thích" bài viết này trước đó chưa
        const [existingLikes] = await connection.query<any>(
            'SELECT id FROM likes WHERE user_id = ? AND post_id = ?',
            [userId, postId]
        );

        if (existingLikes.length > 0) {
            // --- TRƯỜNG HỢP 1: ĐÃ THÍCH -> BÂY GIỜ BỎ THÍCH ---
            
            // Xóa lượt thích khỏi bảng `likes`
            await connection.query(
                'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
                [userId, postId]
            );

            // Trừ điểm của tác giả bài viết
            await connection.query(
                'UPDATE users SET points = GREATEST(0, points - 1) WHERE id = ?',
                [authorId]
            );

            // Commit transaction
            await connection.commit();
            res.status(200).json({ message: 'Đã bỏ thích bài viết.' });

        } else {
            // --- TRƯỜNG HỢP 2: CHƯA THÍCH -> BÂY GIỜ THÍCH ---

            // Thêm một lượt thích mới vào bảng `likes`
            await connection.query(
                'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
                [userId, postId]
            );
            
            // Cộng điểm cho tác giả bài viết
            await connection.query(
                'UPDATE users SET points = points + 1 WHERE id = ?',
                [authorId]
            );
            
            // Commit transaction
            await connection.commit();
            res.status(201).json({ message: 'Đã thích bài viết.' });
        }

    } catch (error) {
        // Nếu có lỗi, hoàn tác tất cả các thay đổi trong transaction
        await connection.rollback();
        console.error('Lỗi khi thích bài viết:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra trên máy chủ.' });
    } finally {
        // Luôn trả kết nối về pool
        connection.release();
    }
};

export const createComment = async (req: Request, res: Response): Promise<void> => {
    const userId = (req.user as JwtPayload).id;
    const postId = parseInt(req.params.postId, 10);
    const { content } = req.body;
    const imageUrl = req.file ? `/uploads/comments/${req.file.filename}` : null;

    if (isNaN(postId)) {
        res.status(400).json({ message: 'Post ID không hợp lệ.'});
        return;
    }

    if (!content && !imageUrl) {
        res.status(400).json({ message: 'Bình luận phải có nội dung hoặc hình ảnh.' });
        return;
    }

    try {
        // Kiểm tra xem bài viết có tồn tại không
        const [posts] = await db.query('SELECT id FROM posts WHERE id = ?', [postId]);
        if ((posts as any).length === 0) {
            res.status(404).json({ message: 'Bài viết không tồn tại.' });
            return;
        }

        // Thêm bình luận vào CSDL
        const [result] = await db.query<any>(
            'INSERT INTO comments (post_id, user_id, content, image_url) VALUES (?, ?, ?, ?)',
            [postId, userId, content || null, imageUrl]
        );

        res.status(201).json({ 
            message: 'Bình luận thành công!',
            commentId: result.insertId,
            imageUrl
        });
    } catch (error) {
        console.error('Lỗi khi bình luận:', error);
        res.status(500).json({ message: 'Đã có lỗi xảy ra trên máy chủ.' });
    }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  // Lấy tham số phân trang từ query string, ví dụ: /api/posts?page=1&limit=10
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const offset = (page - 1) * limit;

  try {
    const [posts] = await db.query<RowDataPacket[]>(`
      SELECT 
        p.id, 
        p.content, 
        p.created_at,
        u.nickname AS author_nickname,
        u.avatar_url AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count,
        -- DÒNG THAY ĐỔI: Dùng GROUP_CONCAT thay cho JSON_ARRAYAGG
        (SELECT CONCAT('[', GROUP_CONCAT(JSON_OBJECT('id', pi.id, 'url', pi.image_url)), ']') FROM post_images pi WHERE pi.post_id = p.id) AS images
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.status = 'approved'
        ORDER BY p.created_at DESC
        LIMIT ?
        OFFSET ?
    `, [limit, offset]);

    res.status(200).json(posts);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bài viết:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};