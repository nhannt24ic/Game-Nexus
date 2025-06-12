// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // 1. Lấy token từ header 'Authorization'
    const authHeader = req.headers.authorization;

    // 2. Kiểm tra xem header có tồn tại và có đúng định dạng 'Bearer <token>' không
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Không có quyền truy cập. Vui lòng cung cấp token.' });
        return;
    }

    try {
        // 3. Tách lấy token
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('JWT_SECRET chưa được định nghĩa trong file .env');
        }

        // 4. Xác thực token
        const decodedPayload = jwt.verify(token, secret);

        // 5. Nếu token hợp lệ, gắn payload đã giải mã vào đối tượng request
        //    để các controller sau có thể sử dụng
        req.user = decodedPayload;

        // 6. Cho phép request đi tiếp đến controller
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
};

export default authMiddleware;