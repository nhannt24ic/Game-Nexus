// src/routes/userRoutes.ts
import express from 'express';
import { registerUser, loginUser, getTopActiveUsers, getCurrentUserProfile, updateAvatar, changePassword, updateProfile, searchUsers, resetPasswordByEmail, updateCoverPhoto } from '../controllers/userController';
import protect from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/top-active', getTopActiveUsers);
router.get('/me', protect, getCurrentUserProfile);
router.put('/update-avatar', protect, updateAvatar);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/search', protect, searchUsers);
router.post('/reset-password', resetPasswordByEmail);
router.put('/update-cover-photo', protect, updateCoverPhoto);

export default router;
