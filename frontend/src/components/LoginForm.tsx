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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  // State cho quên mật khẩu
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetMsg, setResetMsg] = useState('');

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
        setError('Một lỗi không mong muốn đã xảy ra.');
      }
    }
  };

  // Xử lý quên mật khẩu
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg('');
    try {
      const res = await fetch('http://localhost:3000/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, newPassword: resetPassword })
      });
      if (res.ok) setResetMsg('Đặt lại mật khẩu thành công!');
      else setResetMsg('Email không tồn tại hoặc lỗi!');
    } catch {
      setResetMsg('Có lỗi xảy ra!');
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-cyber-purple mb-8 text-center">Đăng nhập</h2>
      {error && <p className="bg-red-500 text-white p-3 rounded mb-4 text-center">{error}</p>}
      {message && <p className="bg-green-500 text-white p-3 rounded mb-4 text-center">{message}</p>}
      {!showReset ? (
        <>
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="block text-gray-300 mb-2" htmlFor="login-username">Tên đăng nhập</label>
              <input
                type="text"
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyber-purple"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-300 mb-2" htmlFor="login-password">Mật khẩu</label>
              <input
                type="password"
                id="login-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyber-purple"
                required
              />
            </div>
            <p className="text-right mt-1 mb-6">
              <button type="button" onClick={() => setShowReset(true)} className="text-blue-400 hover:underline text-sm">Quên mật khẩu?</button>
            </p>
            <button
              type="submit"
              className="w-full bg-cyber-purple text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
            >
              Đăng nhập
            </button>
          </form>
          <p className="mt-6 text-center text-gray-400">
            Chưa có tài khoản?{' '}
            <button onClick={switchToRegister} className="text-cyber-purple font-semibold hover:underline">
              Đăng ký ngay
            </button>
          </p>
        </>
      ) : (
        <div className="bg-white/95 rounded-2xl shadow-2xl p-8 max-w-md mx-auto animate-fade-in border border-purple-200">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <h3 className="text-2xl font-bold text-cyber-purple mb-4 text-center">Quên mật khẩu</h3>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyber-purple"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Mật khẩu mới</label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyber-purple"
                value={resetPassword}
                onChange={e => setResetPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-cyber-purple text-white font-bold py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300">Đặt lại mật khẩu</button>
            {resetMsg && <div className="text-center text-sm mt-2 text-green-600">{resetMsg}</div>}
            <p className="text-center mt-2">
              <button type="button" onClick={() => setShowReset(false)} className="text-blue-400 hover:underline text-sm">Quay lại đăng nhập</button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
