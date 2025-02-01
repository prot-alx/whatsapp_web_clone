import { memo } from "react";
import { ChatInfo } from "../../api/interfaces";
import Messages, { Message } from "./Messages";
import ErrorState from "../ErrorState";
import LoadingState from "../LoadingState";


interface ChatMainProps {
  selectedChat: ChatInfo | null;
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  error: string | null;
}

const ChatMain = memo(
  ({
    selectedChat,
    messages,
    messagesEndRef,
    isLoading,
    error,
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
          <div className="flex-1 overflow-y-auto">{renderChatContent()}</div>
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
export default ChatMain;
