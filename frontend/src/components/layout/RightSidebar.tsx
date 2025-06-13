import React from "react";

const RightSidebar: React.FC = () => {
  const onlineFriends = [
    { name: "Alex Chen", game: "Valorant", avatar: "🎯", status: "In Game" },
    {
      name: "Sarah Kim",
      game: "League of Legends",
      avatar: "⚔️",
      status: "Online",
    },
    { name: "Mike Johnson", game: "CS:GO", avatar: "🔫", status: "In Game" },
    { name: "Emma Wilson", game: "Overwatch", avatar: "🛡️", status: "Online" },
    { name: "David Lee", game: "Apex Legends", avatar: "🎮", status: "Away" },
  ];

  const trendingGames = [
    { name: "Valorant", players: "2.1M", trend: "+12%" },
    { name: "League of Legends", players: "8.5M", trend: "+5%" },
    { name: "CS:GO", players: "1.8M", trend: "+8%" },
    { name: "Overwatch 2", players: "3.2M", trend: "+15%" },
  ];

  return (
    <div className="space-y-6">
      {/* Online Friends */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Friends Online</h3>
            <span className="text-sm text-green-500 font-medium">
              {onlineFriends.length} online
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {onlineFriends.map((friend, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">{friend.avatar}</span>
                  </div>
                  <div
                    className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${
                      friend.status === "In Game"
                        ? "bg-orange-500"
                        : friend.status === "Online"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  ></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {friend.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {friend.game}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending Games */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Trending Games</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {trendingGames.map((game, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {game.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {game.players} players
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-green-600">
                    {game.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gaming Events */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🏆</span>
                <h4 className="font-medium text-gray-900">
                  Valorant Tournament
                </h4>
              </div>
              <p className="text-xs text-gray-600">Tomorrow at 8:00 PM</p>
              <p className="text-xs text-blue-600 font-medium mt-1">
                Prize: $10,000
              </p>
            </div>

            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">🎮</span>
                <h4 className="font-medium text-gray-900">Gaming Meetup</h4>
              </div>
              <p className="text-xs text-gray-600">This Weekend</p>
              <p className="text-xs text-green-600 font-medium mt-1">
                Free Entry
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
