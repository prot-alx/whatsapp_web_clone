import { memo } from "react";
import { ChatInfo } from "../../api/interfaces";
import ChatHeader from "./ChatHeader";
import Messages, { Message } from "./Messages";
import { ErrorState } from "../ErrorState";
import { LoadingState } from "../LoadingState";

interface ChatMainProps {
  selectedChat: ChatInfo | null;
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
}

export const ChatMain = memo(
  ({
    selectedChat,
    messages,
    messagesEndRef,
    isLoading,
    error,
    onBack,
  }: ChatMainProps) => {
    console.log("ChatMain render");

    const renderChatContent = () => {
      if (isLoading) {
        return <LoadingState />;
      }
      if (error) {
        return <ErrorState error={error} />;
      }
      return <Messages messages={messages} messagesEndRef={messagesEndRef} />;
    };

    return (
      <div className="whatsapp-main">
        {selectedChat ? (
          <>
            <div className="flex-none">
              <ChatHeader
                chatId={selectedChat.name ?? selectedChat.id.split("@")[0]}
                onBack={onBack}
              />
            </div>
            <div className="flex-1 overflow-y-auto">{renderChatContent()}</div>
          </>
        ) : (
          <div className="start-chat-message">
            Выберите чат для начала общения
          </div>
        )}
      </div>
    );
  }
);

ChatMain.displayName = "ChatMain";
