// src/controllers/friendController.ts
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import db from "../config/db";
import { RowDataPacket } from "mysql2";

export const getFriends = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req.user as JwtPayload).id;
  try {
    const [friends] = await db.query<RowDataPacket[]>(
      `
            SELECT u.id, u.nickname, u.avatar_url
            FROM friendships f
            JOIN users u ON 
                (CASE WHEN f.user_one_id = ? THEN f.user_two_id ELSE f.user_one_id END) = u.id
            WHERE (f.user_one_id = ? OR f.user_two_id = ?) AND f.status = 'accepted'
        `,
      [userId, userId, userId]
    );
    res.status(200).json(friends);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Thêm các hàm sau vào src/controllers/friendController.ts

// Gửi lời mời kết bạn
export const sendFriendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const senderId = (req.user as JwtPayload).id;
  const receiverId = parseInt(req.params.userId, 10);

  if (senderId === receiverId) {
    res
      .status(400)
      .json({ message: "Bạn không thể tự kết bạn với chính mình." });
    return;
  }

  try {
    // Kiểm tra xem đã có lời mời hoặc đã là bạn bè chưa
    const [existing] = await db.query<RowDataPacket[]>(
      "SELECT * FROM friendships WHERE (user_one_id = ? AND user_two_id = ?) OR (user_one_id = ? AND user_two_id = ?)",
      [senderId, receiverId, receiverId, senderId]
    );
    if (existing.length > 0) {
      res.status(409).json({ message: "Đã gửi lời mời hoặc đã là bạn bè." });
      return;
    }

    // Tạo lời mời mới
    const [result] = await db.query<any>(
      "INSERT INTO friendships (user_one_id, user_two_id, status, action_user_id) VALUES (?, ?, ?, ?)",
      [senderId, receiverId, "pending", senderId]
    );
    res.status(201).json({
      message: "Đã gửi lời mời kết bạn.",
      friendshipId: result.insertId,
    });
  } catch (error) {
    console.error("Lỗi khi gửi lời mời kết bạn:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Lấy danh sách lời mời đã nhận
export const getIncomingRequests = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = (req.user as JwtPayload).id;
  try {
    const [requests] = await db.query<RowDataPacket[]>(
      `
            SELECT f.id, u.id as sender_id, u.nickname, u.avatar_url
            FROM friendships f
            JOIN users u ON f.user_one_id = u.id
            WHERE f.user_two_id = ? AND f.status = 'pending'
        `,
      [userId]
    );
    res.status(200).json(requests);
  } catch (error) {
    console.error("Lỗi khi lấy lời mời đã nhận:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

// Phản hồi lời mời
export const respondToRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const currentUserId = (req.user as JwtPayload).id;
  const friendshipId = parseInt(req.params.friendshipId, 10);
  const { action } = req.body; // action sẽ là 'accept' hoặc 'decline'

  if (action !== "accept" && action !== "decline") {
    res.status(400).json({ message: "Hành động không hợp lệ." });
    return;
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Lấy thông tin lời mời và kiểm tra xem người dùng có quyền phản hồi không
    const [requests] = await connection.query<RowDataPacket[]>(
      'SELECT * FROM friendships WHERE id = ? AND user_two_id = ? AND status = "pending"',
      [friendshipId, currentUserId]
    );

    if (requests.length === 0) {
      res.status(404).json({
        message: "Không tìm thấy lời mời hoặc bạn không có quyền phản hồi.",
      });
      await connection.rollback();
      return;
    }

    if (action === "accept") {
      await connection.query(
        'UPDATE friendships SET status = "accepted", action_user_id = ? WHERE id = ?',
        [currentUserId, friendshipId]
      );
      res.status(200).json({ message: "Đã chấp nhận lời mời kết bạn." });
    } else {
      // action === 'decline'
      await connection.query("DELETE FROM friendships WHERE id = ?", [
        friendshipId,
      ]);
      res.status(200).json({ message: "Đã từ chối lời mời kết bạn." });
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error("Lỗi khi phản hồi lời mời:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  } finally {
    connection.release();
  }
};

export const cancelFriendRequest = async (
  req: Request,
  res: Response
): Promise<void> => {
  const senderId = (req.user as JwtPayload).id;
  // receiverId là ID của người mà ta đã gửi lời mời đến
  const receiverId = parseInt(req.params.receiverId, 10);

  try {
    // Xóa lời mời nếu nó tồn tại, đúng là do người này gửi, và đang ở trạng thái pending
    const [result] = await db.query<any>(
      "DELETE FROM friendships WHERE user_one_id = ? AND user_two_id = ? AND status = ?",
      [senderId, receiverId, "pending"]
    );

    if (result.affectedRows === 0) {
      res
        .status(404)
        .json({ message: "Không tìm thấy lời mời kết bạn để hủy." });
      return;
    }

    res.status(200).json({ message: "Đã hủy lời mời kết bạn." });
  } catch (error) {
    console.error("Lỗi khi hủy lời mời kết bạn:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
