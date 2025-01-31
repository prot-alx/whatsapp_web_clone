import { memo } from "react";

interface ChatInputProps {
  chatId: string;
  newMessage: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  hidePhoneInput?: boolean;
}

const ChatInput = memo(
  ({
    chatId,
    newMessage,
    onMessageChange,
    onSend,
    hidePhoneInput = false,
  }: ChatInputProps) => {
    console.log("ChatInput render");
    return (
      <div className="chat-input-container p-4 border-t border-gray-200">
        {!hidePhoneInput && (
          <input
            type="text"
            value={chatId}
            placeholder="Введите номер телефона"
            className="w-full p-2 mb-2 border rounded"
          />
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Введите сообщение"
            className="flex-1 p-2 border rounded"
            onKeyDown={(e) => e.key === "Enter" && onSend()}
          />
          <button
            onClick={onSend}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Отправить
          </button>
        </div>
      </div>
    );
  }
);

export default ChatInput;
