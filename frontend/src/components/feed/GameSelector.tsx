import React, { useState } from "react";

interface GameSelectorProps {
  onGameSelect: (game: string) => void;
  onClose: () => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({
  onGameSelect,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const popularGames = [
    { name: "Valorant", icon: "🎯", players: "2.1M" },
    { name: "League of Legends", icon: "⚔️", players: "8.5M" },
    { name: "CS:GO", icon: "🔫", players: "1.8M" },
    { name: "Overwatch 2", icon: "🛡️", players: "3.2M" },
    { name: "Apex Legends", icon: "🎮", players: "1.5M" },
    { name: "Fortnite", icon: "🏗️", players: "4.2M" },
    { name: "Minecraft", icon: "🧱", players: "6.1M" },
    { name: "Among Us", icon: "👾", players: "800K" },
    { name: "Fall Guys", icon: "🏃", players: "1.2M" },
    { name: "Rocket League", icon: "🚗", players: "2.8M" },
    { name: "Genshin Impact", icon: "⚡", players: "3.5M" },
    { name: "Call of Duty", icon: "💥", players: "5.2M" },
  ];

  const filteredGames = popularGames.filter((game) =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-h-80 overflow-y-auto z-10">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-medium text-gray-900">Select Game</h4>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Popular Games */}
      <div className="space-y-1">
        <h5 className="text-sm font-medium text-gray-700 mb-2">
          {searchTerm ? "Search Results" : "Popular Games"}
        </h5>
        {filteredGames.map((game, index) => (
          <button
            key={index}
            onClick={() => onGameSelect(game.name)}
            className="w-full flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-left"
          >
            <span className="text-2xl">{game.icon}</span>
            <div className="flex-1">
              <div className="font-medium text-gray-900">{game.name}</div>
              <div className="text-sm text-gray-500">
                {game.players} playing
              </div>
            </div>
          </button>
        ))}

        {filteredGames.length === 0 && searchTerm && (
          <div className="text-center py-4 text-gray-500">
            No games found for "{searchTerm}"
          </div>
        )}
      </div>

      {/* Custom Game Option */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            const customGame = prompt("Enter custom game name:");
            if (customGame) {
              onGameSelect(customGame);
            }
          }}
          className="w-full flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-blue-600"
        >
          <span className="text-xl">➕</span>
          <span className="font-medium">Add Custom Game</span>
        </button>
      </div>
    </div>
  );
};

export default GameSelector;
