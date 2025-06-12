// src/types/express.d.ts
// File này dùng để mở rộng (extend) các định nghĩa type có sẵn của Express

// Import kiểu JwtPayload từ thư viện jsonwebtoken
import { JwtPayload } from 'jsonwebtoken';

// Khai báo một module toàn cục cho Express
declare global {
  namespace Express {
    // Mở rộng interface Request
    export interface Request {
      // Thêm thuộc tính user vào Request, có thể là JwtPayload hoặc một chuỗi
      user?: JwtPayload | string;
    }
  }
}