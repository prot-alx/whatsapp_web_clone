import React, { useState, useCallback } from "react";
import { X } from "lucide-react";

interface NewChatFormProps {
  onSubmit: (phoneNumber: string) => void;
  onClose: () => void;
}

export const NewChatForm: React.FC<NewChatFormProps> = ({
  onSubmit,
  onClose,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length < 11) {
      setError("Введите корректный номер телефона");
      return;
    }
    onSubmit(cleaned);
    onClose();
  };

  // Обработка ввода только цифр
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numbers = value.replace(/\D/g, "");
    setPhoneNumber(numbers);
    setError("");
  };

  // Обработка клика по оверлею
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div className="whatsapp-modal-overlay" onClick={handleOverlayClick}>
      <div className="whatsapp-new-chat-form">
        <div className="whatsapp-new-chat-header">
          <h3 className="text-lg font-medium">Новый чат</h3>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="whatsapp-form-label">
              Номер телефона
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="79991234567"
              maxLength={11}
              className="whatsapp-phone-input"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            <p className="mt-1 text-xs text-gray-500">
              Введите номер телефона в формате 79991234567
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="whatsapp-cancel-btn"
            >
              Отмена
            </button>
            <button type="submit" className="whatsapp-submit-btn">
              Создать чат
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
