import React from "react";
import { ChevronLeft } from "lucide-react";

interface ChatHeaderProps {
  chatId: string;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatId, onBack }) => {
  return (
    <div className="whatsapp-chat-header">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="back-to-contacts-button">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="chat-avatar">{chatId.charAt(0).toUpperCase()}</div>
          <h2 className="text-lg font-medium">{chatId || "..."}</h2>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
