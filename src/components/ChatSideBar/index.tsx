import { ChatInfo } from "../../api/interfaces";
import { ChatList } from "./ChatList";
import { SidebarHeader } from "./SidebarHeader";
import { memo, useCallback } from "react";

interface ChatSidebarProps {
  chats: ChatInfo[];
  selectedChat: ChatInfo | null;
  onChatSelect: (chat: ChatInfo) => void;
  onLogout: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = memo(
  ({ chats, selectedChat, onChatSelect, onLogout }) => {
    const onLogoutCallback = useCallback(() => {
      onLogout();
    }, [onLogout]);

    return (
      <div className="w-1/3 bg-white border-r border-gray-200">
        <SidebarHeader onLogout={onLogoutCallback} />
        <ChatList
          chats={chats}
          selectedChat={selectedChat}
          onChatSelect={onChatSelect}
        />
      </div>
    );
  }
);
