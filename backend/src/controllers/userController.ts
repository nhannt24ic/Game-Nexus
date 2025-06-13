// src/controllers/userController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import db from "../config/db";
import { RowDataPacket } from "mysql2";

// Định nghĩa một interface cho User để TypeScript hiểu cấu trúc
interface User extends RowDataPacket {
  id: number;
  username: string;
  password_hash: string;
  role: "member" | "moderator" | "admin";
  status: "active" | "locked";
}

// Thêm kiểu trả về `: Promise<void>`
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, email, password, nickname } = req.body;

  if (!username || !email || !password || !nickname) {
    // Bỏ `return` ở đây, thêm `return;` ở dòng dưới
    res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
    return;
  }

  try {
    const [existingUsers] = await db.query<User[]>(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUsers.length > 0) {
      res.status(409).json({ message: "Username hoặc email đã tồn tại." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await db.query<any>(
      "INSERT INTO users (username, email, password_hash, nickname) VALUES (?, ?, ?, ?)",
      [username, email, password_hash, nickname]
    );

    res.status(201).json({
      message: "Đăng ký tài khoản thành công!",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký người dùng:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra trên máy chủ." });
  }
};

// Thêm kiểu trả về `: Promise<void>`
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Vui lòng nhập username và password." });
    return;
  }

  try {
    const [users] = await db.query<User[]>(
      "SELECT id, username, password_hash, role, status FROM users WHERE username = ?",
      [username]
    );

    const user = users[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      res
        .status(401)
        .json({ message: "Username hoặc mật khẩu không chính xác." });
      return;
    }

    if (user.status === "locked") {
      res.status(403).json({ message: "Tài khoản này đã bị khóa." });
      return;
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET chưa được định nghĩa trong file .env");
      // Gửi lỗi một cách an toàn mà không tiết lộ chi tiết
      res.status(500).json({ message: "Lỗi cấu hình máy chủ." });
      return;
    }

    const token = jwt.sign(payload, secret, { expiresIn: "1d" });

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token: token,
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({ message: "Đã có lỗi xảy ra trên máy chủ." });
  }
};

export const getTopActiveUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [users] = await db.query<RowDataPacket[]>(`
      SELECT id, nickname, avatar_url, points 
      FROM users
      ORDER BY points DESC
      LIMIT 10
    `);
    res.status(200).json(users);
  } catch (error) {
    console.error("Lỗi khi lấy top người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getCurrentUserProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Lấy id từ token đã được authMiddleware giải mã và gắn vào req.user
    const userId = (req.user as JwtPayload).id;

    const [users] = await db.query<RowDataPacket[]>(
      "SELECT id, username, nickname, avatar_url FROM users WHERE id = ?",
      [userId]
    );

    if (users.length === 0) {
      res.status(404).json({ message: "Không tìm thấy người dùng." });
      return;
    }

    res.status(200).json(users[0]);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin cá nhân:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as JwtPayload).id;
    const { avatar_url } = req.body;
    if (!avatar_url) {
      res.status(400).json({ message: "Thiếu avatar_url" });
      return;
    }
    await db.query("UPDATE users SET avatar_url = ? WHERE id = ?", [
      avatar_url,
      userId,
    ]);
    res.status(200).json({ message: "Cập nhật avatar thành công", avatar_url });
  } catch (error) {
    console.error("Lỗi khi cập nhật avatar:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id || req.user?.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ message: "Thiếu thông tin" });

    // Lấy password_hash hiện tại
    const [users] = await db.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [userId]
    );
    if (!users || users.length === 0)
      return res.status(404).json({ message: "Không tìm thấy user" });

    const valid = await bcrypt.compare(oldPassword, users[0].password_hash);
    if (!valid)
      return res.status(401).json({ message: "Mật khẩu cũ không đúng" });

    // Hash mật khẩu mới và cập nhật
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [
      newHash,
      userId,
    ]);
    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req.user as JwtPayload).id;
    const { email, bio } = req.body;
    if (!email) {
      res.status(400).json({ message: "Thiếu email" });
      return;
    }
    await db.query("UPDATE users SET email = ?, bio = ? WHERE id = ?", [
      email,
      bio,
      userId,
    ]);
    res.status(200).json({ message: "Cập nhật thông tin thành công" });
  } catch (error) {
    console.error("Lỗi update profile:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const currentUserId = (req.user as JwtPayload).id;
  const query = req.query.q as string;

  if (!query) {
    res.json([]);
    return;
  }

  try {
    // Thêm f.id AS friendship_id vào câu lệnh SELECT
    const [users] = await db.query<RowDataPacket[]>(
      `
            SELECT 
                u.id, 
                u.nickname, 
                u.avatar_url,
                f.id AS friendship_id, 
                f.status AS friendship_status,
                f.action_user_id 
            FROM users u
            LEFT JOIN friendships f ON 
                (f.user_one_id = u.id AND f.user_two_id = ?) OR 
                (f.user_one_id = ? AND f.user_two_id = u.id)
            WHERE 
                (u.nickname LIKE ? OR u.username LIKE ?) AND u.id != ?
            ORDER BY
                CASE WHEN u.nickname = ? THEN 0 ELSE 1 END,
                u.nickname
            LIMIT 20;
        `,
      [
        currentUserId,
        currentUserId,
        `%${query}%`,
        `%${query}%`,
        currentUserId,
        query,
      ]
    );

    res.status(200).json(users);
  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
