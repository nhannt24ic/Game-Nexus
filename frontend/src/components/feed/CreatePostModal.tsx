import React, { useState, useRef, useEffect } from "react";
import ImageUpload from "./ImageUpload";
import EmojiPicker from "./EmojiPicker";
import GameSelector from "./GameSelector";
import Avatar from "../common/Avatar";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "general" | "photo" | "game" | "stream";
  onPostCreated?: () => void;
  onCreatePost?: (content: string, images: File[]) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  initialType = "general",
  onPostCreated,
}) => {
  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [user, setUser] = useState<{
    nickname: string;
    avatar_url: string | null;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:3000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data)
          setUser({ nickname: data.nickname, avatar_url: data.avatar_url });
      });
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && initialType === "photo") {
      // Auto-focus on image upload for photo posts
    } else if (isOpen && initialType === "game") {
      setShowGameSelector(true);
    }
  }, [isOpen, initialType]);

  // Hàm upload 1 file lên Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "GameNexus"); // Thay bằng upload_preset của bạn
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dfsj2bcpi/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && selectedImages.length === 0) return;
    setIsLoading(true);
    try {
      // Upload tất cả ảnh lên Cloudinary
      const imageUrls: string[] = [];
      for (const file of selectedImages) {
        const url = await uploadToCloudinary(file);
        imageUrls.push(url);
      }
      // Gửi post lên backend
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: postContent,
          images: imageUrls,
        }),
      });
      if (!res.ok) throw new Error("Đăng bài thất bại!");
      setPostContent("");
      setSelectedImages([]);
      setSelectedGame("");
      setShowEmojiPicker(false);
      setShowGameSelector(false);
      if (onPostCreated) onPostCreated();
      onClose();
    } catch (err) {
      alert("Đăng bài thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent =
        postContent.slice(0, start) + emoji + postContent.slice(end);
      setPostContent(newContent);

      // Set cursor position after emoji
      setTimeout(() => {
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        textarea.focus();
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const handleGameSelect = (game: string) => {
    setSelectedGame(game);
    setShowGameSelector(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {initialType === "photo"
              ? "Share Photos"
              : initialType === "game"
              ? "Share Gaming Moment"
              : initialType === "stream"
              ? "Go Live"
              : "Create Post"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 pb-4">
          <div className="flex items-center space-x-3">
            {user ? (
              <Avatar
                user={{
                  id: 0,
                  nickname: user.nickname,
                  avatar_url: user.avatar_url,
                }}
                className="w-12 h-12 border-2 border-cyber-purple"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">?</span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">
                {user ? user.nickname : "..."}
              </h3>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Content Area */}
          <div className="px-6 pb-4">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={
                  initialType === "photo"
                    ? "Share your gaming screenshots..."
                    : initialType === "game"
                    ? "How's your gaming session going?"
                    : initialType === "stream"
                    ? "Tell viewers what you're streaming..."
                    : "What's happening in your gaming world?"
                }
                className="w-full h-32 resize-none border-0 text-lg placeholder-gray-500 focus:outline-none"
                maxLength={500}
              />

              {/* Character Count */}
              <div className="absolute bottom-2 right-2">
                <span
                  className={`text-sm ${
                    postContent.length > 450 ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {postContent.length}/500
                </span>
              </div>
            </div>

            {/* Game Tag */}
            {selectedGame && (
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🎮</span>
                    <span className="font-medium text-blue-800">
                      Playing {selectedGame}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedGame("")}
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Stream Settings */}
            {initialType === "stream" && (
              <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-lg">📺</span>
                  <span className="font-medium text-red-800">
                    Live Stream Settings
                  </span>
                </div>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Stream title..."
                    className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <select className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
                    <option>Select Platform</option>
                    <option>Twitch</option>
                    <option>YouTube</option>
                    <option>Facebook Gaming</option>
                  </select>
                </div>
              </div>
            )}

            {/* Image Upload */}
            <div className="mt-4">
              <ImageUpload
                images={selectedImages}
                onImagesChange={setSelectedImages}
                maxImages={4}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {/* Photo Button - giống HomePage, đặt ở góc dưới bên trái */}
                <button
                  type="button"
                  onClick={() => document.getElementById('modal-photo-input')?.click()}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <span className="text-xl">📸</span>
                  <span className="font-medium">Photo</span>
                </button>
                {/* Hidden input để chọn ảnh */}
                <input
                  id="modal-photo-input"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => {
                    if (e.target.files) {
                      setSelectedImages(prev => [...prev, ...Array.from(e.target.files!)]);
                    }
                  }}
                />
                {/* Game Selection */}
                <button
                  type="button"
                  onClick={() => setShowGameSelector(!showGameSelector)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <span className="text-xl">🎮</span>
                  <span className="font-medium">Game</span>
                </button>

                {/* Emoji Picker */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <span className="text-xl">😊</span>
                  <span className="font-medium">Emoji</span>
                </button>

                {/* Location */}
                <button
                  type="button"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <span className="text-xl">📍</span>
                  <span className="font-medium">Location</span>
                </button>
              </div>

              {/* Post Button */}
              <button
                type="submit"
                disabled={
                  (!postContent.trim() && selectedImages.length === 0) ||
                  isLoading
                }
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>
                      {initialType === "stream"
                        ? "Going Live..."
                        : "Posting..."}
                    </span>
                  </>
                ) : (
                  <span>{initialType === "stream" ? "Go Live" : "Post"}</span>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            onClose={() => setShowEmojiPicker(false)}
          />
        )}

        {/* Game Selector */}
        {showGameSelector && (
          <GameSelector
            onGameSelect={handleGameSelect}
            onClose={() => setShowGameSelector(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
