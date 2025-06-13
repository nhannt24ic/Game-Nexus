// src/routes/postRoutes.ts
import express from "express";
import {
  createPost,
  toggleLikePost,
  createComment,
  getAllPosts,
} from "../controllers/postController";
import authMiddleware from "../middlewares/authMiddleware";
import { uploadPostImage, uploadCommentImage } from "../config/upload";

const router = express.Router();

// Định nghĩa route để tạo bài viết mới
// POST /api/posts/
// Middleware `authMiddleware` sẽ chạy trước, nếu hợp lệ mới đến `createPost`
router.post(
  "/",
  authMiddleware,
  uploadPostImage.array("postImages", 10),
  createPost
);
router.post("/:postId/like", authMiddleware, toggleLikePost);
router.post(
  "/:postId/comments",
  authMiddleware,
  uploadCommentImage.single("commentImage"),
  createComment
);
router.get("/", authMiddleware, getAllPosts);

export default router;
