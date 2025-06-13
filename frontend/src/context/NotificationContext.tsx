// src/context/NotificationContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";
import { type Notification } from "../types";

// Định nghĩa kiểu cho Context
interface NotificationContextType {
  addNotification: (message: string, type: Notification["type"]) => void;
}

// Tạo Context
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Tạo Provider Component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: Notification["type"]) => {
    const id = Date.now() + Math.random();
    const newNotification: Notification = { id, message, type };

    // Thêm thông báo mới vào danh sách
    setNotifications((prev) => [...prev, newNotification]);

    // Tự động xóa thông báo sau 5 giây
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {/* Container để hiển thị các thông báo */}
      <NotificationContainer notifications={notifications} />
    </NotificationContext.Provider>
  );
};

// Tạo custom hook để dễ dàng sử dụng
export const useNotifier = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifier phải được sử dụng bên trong NotificationProvider"
    );
  }
  return context.addNotification;
};

// Component hiển thị các thông báo (toast)
interface NotificationContainerProps {
  notifications: Notification[];
}
const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
}) => {
  return (
    <div className="fixed top-20 right-4 z-[100] space-y-3 w-80">
      {notifications.map((notification) => (
        <Toast key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

// Component cho một toast đơn lẻ
const Toast: React.FC<{ notification: Notification }> = ({ notification }) => {
  const baseClasses =
    "p-4 rounded-lg shadow-xl text-white font-semibold animate-slide-in-right";
  const typeClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div className={`${baseClasses} ${typeClasses[notification.type]}`}>
      {notification.message}
    </div>
  );
};
