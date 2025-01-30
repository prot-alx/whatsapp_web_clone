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

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    onChatIdChange(value);
  };

  return (
    <div className="input-area">
      <input
        type="tel"
        placeholder="Номер телефона получателя"
        value={chatId}
        onChange={handlePhoneInput}
        pattern="[0-9]*"
        inputMode="numeric"
        aria-label="Номер телефона получателя"
        title="Введите номер телефона"
        className="number-input-field"
        maxLength={15}
        autoComplete="tel"
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
