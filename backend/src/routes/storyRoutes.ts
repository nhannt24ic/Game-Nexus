import express from 'express';
import { createStory, getActiveStories } from '../controllers/storyController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

// Route để tạo một story mới
router.post('/', authMiddleware, createStory);

// Route để lấy tất cả story còn hiệu lực
router.get('/', authMiddleware, getActiveStories);

export default router; 