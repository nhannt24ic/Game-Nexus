// src/components/LoginForm.tsx
import React, { useState } from "react";

// --- Định nghĩa kiểu dữ liệu cho các phản hồi từ API ---
interface LoginSuccessResponse {
  message: string;
  token: string;
}

interface ApiErrorResponse {
  message: string;
}

interface LoginFormProps {
  switchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ switchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        // Xử lý lỗi từ API một cách rõ ràng
        const errorData: ApiErrorResponse = await response.json();
        throw new Error(
          errorData.message || "Có lỗi xảy ra, vui lòng thử lại."
        );
      }

      // Xử lý thành công với kiểu dữ liệu cụ thể
      const successData: LoginSuccessResponse = await response.json();

      setMessage("Đăng nhập thành công! Đang chuyển hướng...");
      localStorage.setItem("token", successData.token); // Lưu token
      window.location.href = "/"; // Chuyển hướng về trang chủ
    } catch (err) {
      // --- Xử lý lỗi trong khối catch một cách an toàn ---
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Một lỗi không mong muốn đã xảy ra.");
      }
    }
  };

  return (
    // ...Phần JSX của bạn giữ nguyên không đổi...
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-cyber-purple mb-8 text-center">
        Đăng nhập
      </h2>
      {error && (
        <p className="bg-red-500 text-white p-3 rounded mb-4 text-center">
          {error}
        </p>
      )}
      {message && (
        <p className="bg-green-500 text-white p-3 rounded mb-4 text-center">
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="login-username">
            Tên đăng nhập
          </label>
          <input
            type="text"
            id="login-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyber-purple"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2" htmlFor="login-password">
            Mật khẩu
          </label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyber-purple"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-cyber-purple text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
        >
          Đăng nhập
        </button>
      </form>
      <p className="mt-6 text-center text-gray-400">
        Chưa có tài khoản?{" "}
        <button
          onClick={switchToRegister}
          className="text-cyber-purple font-semibold hover:underline"
        >
          Đăng ký ngay
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
