// src/routes/userRoutes.ts
import express from 'express';
import { registerUser, loginUser, getTopActiveUsers, getCurrentUserProfile, updateAvatar, changePassword, updateProfile } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUserProfile);
router.get('/top', authMiddleware, getTopActiveUsers);
router.put('/update-avatar', authMiddleware, updateAvatar);
router.put('/change-password', authMiddleware, changePassword);
router.put('/update-profile', authMiddleware, updateProfile);

export default router;