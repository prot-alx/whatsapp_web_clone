import { ChatInfo } from "../../api/interfaces";

interface ChatListProps {
  chats: ChatInfo[];
  selectedChat: ChatInfo | null;
  onChatSelect: (chat: ChatInfo) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onChatSelect,
}) => (
  <div className="overflow-y-auto h-[calc(100vh-70px)]">
    {chats.map((chat) => (
      <button
        key={chat.id}
        onClick={() => onChatSelect(chat)}
        className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
          selectedChat?.id === chat.id ? "bg-blue-50" : ""
        }`}
        aria-pressed={selectedChat?.id === chat.id}
      >
        <span className="font-medium">
          {chat.name ?? chat.id.split("@")[0]}
        </span>
      </button>
    ))}
  </div>
);
