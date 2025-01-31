import React from "react";
import { LogOut } from "lucide-react";

interface ChatHeaderProps {
  chatId: string;
  onLogout: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatId, onLogout }) => {
  return (
    <div className="chat-header">
      <h2 className="text-xl font-semibold">Чат с {chatId || "..."}</h2>
      <button
        onClick={onLogout}
        className="logout-button"
        title="Выйти"
      >
        <LogOut className="w-5 h-5" />
        <span>Выйти</span>
      </button>
    </div>
  );
};

export default ChatHeader;
