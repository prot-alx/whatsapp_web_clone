import React from "react";
import { ChatInfo } from "../../api/interfaces";
import { Check } from "lucide-react";

interface ChatListProps {
  chats: ChatInfo[];
  selectedChat: ChatInfo | null;
  onChatSelect: (chat: ChatInfo) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onChatSelect,
}) => {
  console.log("ChatList render");
  const getInitials = (chat: ChatInfo) => {
    const name = chat.name ?? chat.id.split("@")[0];
    return name.charAt(0).toUpperCase();
  };
  return (
    <div className="whatsapp-chat-list">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onChatSelect(chat)}
          className={`whatsapp-chat-item ${
            selectedChat?.id === chat.id ? "bg-gray-100" : ""
          }`}
          aria-pressed={selectedChat?.id === chat.id}
        >
          {/* Аватар */}
          <div className="whatsapp-avatar">{getInitials(chat)}</div>

          {/* Информация о чате */}
          <div className="whatsapp-chat-info">
            <div className="whatsapp-chat-contact">
              <span className="whatsapp-chat-name">
                {chat.name ?? chat.id.split("@")[0]}
              </span>
            </div>

            {/* Имитация превью последнего сообщения */}
            <div className="whatsapp-chat-preview">
              <div className="flex-shrink-0">
                <Check className="w-4 h-4 text-gray-400" />
              </div>
              <p className="whatsapp-last-message">
                Нажмите, чтобы начать общение
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChatList;
