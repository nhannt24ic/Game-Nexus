// src/config/upload.ts
import multer from 'multer';
import path from 'path';

// Hàm để tạo một cấu hình lưu trữ cho multer
const createStorage = (destination: string) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destination);
        },
        filename: (req, file, cb) => {
            // Tạo tên file duy nhất để tránh trùng lặp
            // Tên file sẽ có dạng: ten-goc-timestamp.phần-mở-rộng
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    });
};

// Tạo các instance của multer cho từng loại upload
export const uploadPostImage = multer({ storage: createStorage('./public/uploads/posts') });
export const uploadCommentImage = multer({ storage: createStorage('./public/uploads/comments') });