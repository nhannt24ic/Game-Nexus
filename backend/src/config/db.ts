// src/config/db.ts
import mysql from "mysql2/promise"; // Sử dụng mysql2/promise để làm việc với async/await dễ dàng hơn
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Kiểm tra kết nối ban đầu
pool
  .getConnection()
  .then((connection) => {
    console.log(
      `Đã kết nối thành công đến cơ sở dữ liệu MySQL: ${process.env.DB_NAME}`
    );
    connection.release();
  })
  .catch((err) => {
    console.error("Lỗi kết nối đến MySQL:", err.message);
    if (err.code === "ECONNREFUSED") {
      console.error(
        "Kết nối CSDL bị từ chối. Hãy đảm bảo MySQL server đang chạy và thông tin cấu hình trong .env là chính xác."
      );
    }
  });

export default pool;
