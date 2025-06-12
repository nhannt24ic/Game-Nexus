// src/routes/postRoutes.ts
import express from 'express';
import { createPost } from '../controllers/postController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Định nghĩa route để tạo bài viết mới
// POST /api/posts/
// Middleware `authMiddleware` sẽ chạy trước, nếu hợp lệ mới đến `createPost`
router.post('/', authMiddleware, createPost);

export default router;