import React, { useState, useRef, useEffect } from "react";
import Messages from "./Messages";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useMessages } from "../hooks/useMessages";

interface ChatProps {
  idInstance: string;
  apiTokenInstance: string;
  onLogout: () => void;
}

const Chat: React.FC<ChatProps> = ({
  idInstance,
  apiTokenInstance,
  onLogout,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useMessages({
    idInstance,
    apiTokenInstance,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleLogout = () => {
    localStorage.removeItem("green_api_credentials");
    onLogout();
  };

  const handleSendMessage = () => {
    sendMessage(chatId, newMessage);
    setNewMessage("");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <ChatHeader chatId={chatId} onLogout={handleLogout} />
        <Messages messages={messages} messagesEndRef={messagesEndRef} />
        <ChatInput
          chatId={chatId}
          newMessage={newMessage}
          onChatIdChange={setChatId}
          onMessageChange={setNewMessage}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
