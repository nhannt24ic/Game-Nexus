// src/routes/friendRoutes.ts
import express from 'express';
import { getFriends } from '../controllers/friendController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, getFriends);

export default router;