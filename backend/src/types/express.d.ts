// backend/src/types/express.d.ts

import { JwtPayload } from 'jsonwebtoken';

// Sử dụng 'declare global' để hợp nhất (merge) type vào trong namespace có sẵn của Express
declare global {
  namespace Express {
    // Mở rộng interface Request có sẵn
    export interface Request {
      // Định nghĩa rằng đối tượng Request của chúng ta BÂY GIỜ có thể có thuộc tính 'user'
      user?: JwtPayload | string;
    }
  }
}

// File này không cần export gì cả. Chỉ cần nó tồn tại là TypeScript sẽ tự động nhận diện.