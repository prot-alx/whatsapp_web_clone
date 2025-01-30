import axios from "axios";
import {
  SendMessageResponse,
  ReceiveMessageResponse,
  Credentials,
} from "./interfaces";

const BASE_URL = "https://api.green-api.com";

export const sendMessage = async (
  idInstance: string,
  apiTokenInstance: string,
  chatId: string,
  message: string
): Promise<SendMessageResponse> => {
  const url = `${BASE_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
  const response = await axios.post(url, {
    chatId: `${chatId}@c.us`,
    message,
  });
  return response.data;
};

export const receiveMessage = async (
  idInstance: string,
  apiTokenInstance: string
): Promise<ReceiveMessageResponse | null> => {
  const url = `${BASE_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=20`;
  const response = await axios.get(url);
  return response.data;
};

export const deleteNotification = async (
  idInstance: string,
  apiTokenInstance: string,
  receiptId: number
): Promise<void> => {
  const url = `${BASE_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
  await axios.delete(url);
};

export const authenticate = async (
  credentials: Credentials
): Promise<{ success: boolean; message: string }> => {
  const { idInstance, apiTokenInstance } = credentials;
  const url = `${BASE_URL}/waInstance${idInstance}/getSettings/${apiTokenInstance}`;

  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return { success: true, message: "Аутентификация прошла успешно" };
    }
    return {
      success: false,
      message: response.statusText || "Неизвестная ошибка",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return {
          success: false,
          message: error.response.statusText || "Ошибка на сервере",
        };
      }
      return {
        success: false,
        message: "Проверьте корректность вводимых данных.",
      };
    }
    return { success: false, message: "Неизвестная ошибка" };
  }
};
