// src/components/RegisterForm.tsx
import React, { useState } from "react";

// --- Định nghĩa kiểu dữ liệu ---
interface RegisterSuccessResponse {
  message: string;
  userId: number;
}

interface ApiErrorResponse {
  message: string;
}

interface RegisterFormProps {
  switchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ switchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!username || !email || !nickname || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, nickname, password }),
      });

      const data: ApiErrorResponse | RegisterSuccessResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Có lỗi xảy ra.");
      }
      setMessage("Đăng ký thành công! Vui lòng chuyển sang trang đăng nhập.");
    } catch (err) {
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
        Tạo tài khoản
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
          <label className="block text-gray-300 mb-2" htmlFor="reg-username">
            Tên đăng nhập
          </label>
          <input
            type="text"
            id="reg-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyber-purple"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="reg-email">
            Email
          </label>
          <input
            type="email"
            id="reg-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyber-purple"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-300 mb-2" htmlFor="reg-nickname">
            Tên hiển thị (Nickname)
          </label>
          <input
            type="text"
            id="reg-nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyber-purple"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-300 mb-2" htmlFor="reg-password">
            Mật khẩu
          </label>
          <input
            type="password"
            id="reg-password"
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
          Đăng ký
        </button>
      </form>
      <p className="mt-6 text-center text-gray-400">
        Đã có tài khoản?{" "}
        <button
          onClick={switchToLogin}
          className="text-cyber-purple font-semibold hover:underline"
        >
          Đăng nhập
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;
