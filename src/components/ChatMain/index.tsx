import { memo } from "react";
import { ChatInfo } from "../../api/interfaces";
import ChatHeader from "./ChatHeader";
import Messages, { Message } from "./Messages";
import { ErrorState } from "../ErrorState";

interface ChatMainProps {
  selectedChat: ChatInfo | null;
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onLogout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const ChatMain = memo(
  ({
    selectedChat,
    messages,
    messagesEndRef,
    onLogout,
    isLoading,
    error,
  }: ChatMainProps) => {
    console.log("ChatMain render");

    const renderChatContent = () => {
      if (isLoading) {
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-600">Загрузка сообщений...</div>
          </div>
        );
      }

      if (error) {
        return (
          <div className="flex-1 flex items-center justify-center">
            <ErrorState error={error} />
          </div>
        );
      }

      return <Messages messages={messages} messagesEndRef={messagesEndRef} />;
    };

    return (
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <ChatHeader
              chatId={selectedChat.name ?? selectedChat.id.split("@")[0]}
              onLogout={onLogout}
            />
            {renderChatContent()}
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
