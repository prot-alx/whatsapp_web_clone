import { memo, useState } from "react";
import { ChatInfo } from "../../api/interfaces";
import ChatList from "./ChatList";
import NewChatForm from "./newChatForm";
import SidebarHeader from "./SidebarHeader";

interface ChatSidebarProps {
  chats: ChatInfo[];
  selectedChat: ChatInfo | null;
  onChatSelect: (chat: ChatInfo) => void;
  onLogout: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = memo(
  ({ chats, selectedChat, onChatSelect, onLogout }) => {
    console.log("ChatSideBar render");
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);

    const handleNewChat = (phoneNumber: string) => {
      const chatId = `${phoneNumber}@c.us`;
      onChatSelect({
        id: chatId,
        name: phoneNumber,
        archive: false,
        notSpam: false,
        ephemeralExpiration: 0,
        ephemeralSettingTimestamp: 0,
      });
    };

    return (
      <div className="h-full flex flex-col">
        <SidebarHeader
          onLogout={onLogout}
          onNewChat={() => setIsNewChatOpen(true)}
        />
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onChatSelect={onChatSelect}
        />
        {isNewChatOpen && (
          <NewChatForm
            onSubmit={handleNewChat}
            onClose={() => setIsNewChatOpen(false)}
          />
        )}
      </div>
    );
  }
);

ChatSidebar.displayName = "ChatSidebar";
