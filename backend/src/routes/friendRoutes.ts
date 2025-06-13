// src/routes/friendRoutes.ts
import express from "express";
import {
  getFriends,
  sendFriendRequest,
  getIncomingRequests,
  respondToRequest,
  cancelFriendRequest,
} from "../controllers/friendController";
import authMiddleware from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getFriends);
router.post("/request/:userId", authMiddleware, sendFriendRequest);
router.get("/requests/incoming", authMiddleware, getIncomingRequests);
router.put("/requests/:friendshipId", authMiddleware, respondToRequest);
router.delete("/request/sent/:receiverId", authMiddleware, cancelFriendRequest);

export default router;
