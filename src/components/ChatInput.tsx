import React from "react";

interface ChatInputProps {
  chatId: string;
  newMessage: string;
  onChatIdChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSend: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  chatId,
  newMessage,
  onChatIdChange,
  onMessageChange,
  onSend,
}) => {
  const isDisabled = !chatId.trim() || !newMessage.trim();

  return (
    <div className="input-area">
      <input
        type="text"
        placeholder="Номер телефона получателя"
        value={chatId}
        onChange={(e) => onChatIdChange(e.target.value)}
        className="number-input-field"
      />
      <div className="send-message-block">
        <input
          type="text"
          placeholder="Введите сообщение"
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          className="chat-input-field"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isDisabled) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <button
          onClick={onSend}
          disabled={isDisabled}
          className={`send-button ${
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
