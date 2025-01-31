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
  try {
    const url = `${BASE_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;
    const response = await axios.post(url, {
      chatId: `${chatId}@c.us`,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка отправки сообщения:", error);
    throw error;
  }
};

export const receiveMessage = async (
  idInstance: string,
  apiTokenInstance: string
): Promise<ReceiveMessageResponse | null> => {
  try {
    const url = `${BASE_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=20`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Ошибка получения сообщения:", error);
    return null;
  }
};

export const deleteNotification = async (
  idInstance: string,
  apiTokenInstance: string,
  receiptId: number
): Promise<void> => {
  try {
    const url = `${BASE_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;
    await axios.delete(url);
  } catch (error) {
    console.error("Ошибка удаления уведомления:", error);
    throw error;
  }
};

export const authenticate = async (
  credentials: Credentials
): Promise<{ success: boolean; message: string }> => {
  try {
    const { idInstance, apiTokenInstance } = credentials;
    const url = `${BASE_URL}/waInstance${idInstance}/getSettings/${apiTokenInstance}`;
    await axios.get(url);

    return {
      success: true,
      message: "Аутентификация прошла успешно",
    };
  } catch (error) {
    console.error("Ошибка аутентификации:", error);
    return {
      success: false,
      message: "Ошибка аутентификации",
    };
  }
};
