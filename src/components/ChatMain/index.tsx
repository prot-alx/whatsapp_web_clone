import { memo } from "react";
import { ChatInfo } from "../../api/interfaces";
import ChatHeader from "./ChatHeader";
import Messages, { Message } from "./Messages";

interface ChatMainProps {
  selectedChat: ChatInfo | null;
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onLogout: () => void;
  isLoading: boolean;
}

export const ChatMain = memo(
  ({
    selectedChat,
    messages,
    messagesEndRef,
    onLogout,
    isLoading,
  }: ChatMainProps) => {
    console.log("ChatMain render");

    return (
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <ChatHeader
              chatId={selectedChat.name ?? selectedChat.id.split("@")[0]}
              onLogout={onLogout}
            />
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-600">Загрузка сообщений...</div>
              </div>
            ) : (
              <Messages messages={messages} messagesEndRef={messagesEndRef} />
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Выберите чат для начала общения
          </div>
        )}
      </div>
    );
  }
);

ChatMain.displayName = "ChatMain";
