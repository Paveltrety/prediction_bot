import { messagesCollectionsApi } from './api/messagesCollectionsApi';
import { messagesHistoryCollection } from './init';

interface IUpdateUserCountParams {
  isHasUserInfo: boolean;
  userId: number;
  username?: string;
}

const updateUserPredictionCount = async ({ isHasUserInfo, userId, username }: IUpdateUserCountParams) => {
  try {
    if (isHasUserInfo) {
      // Увеличиваем счетчик сообщений
      await messagesCollectionsApi.updateUserInfo({ userId }, { $inc: { predictionCount: 1 } });
    } else {
      // Если пользователя нет, создаем новую запись
      await messagesCollectionsApi.createUser({
        userId,
        username: username || 'unknown',
        messageCount: 0,
        predictionCount: 1,
      });
    }
  } catch (err) {
    console.error('Ошибка обновления статистики:', err);
  }
};

const updateUserMessageCount = async ({ isHasUserInfo, userId, username }: IUpdateUserCountParams) => {
  try {
    if (isHasUserInfo) {
      // Увеличиваем счетчик сообщений
      await messagesCollectionsApi.updateUserInfo({ userId }, { $inc: { messageCount: 1 } });
    } else {
      // Если пользователя нет, создаем новую запись
      await messagesCollectionsApi.createUser({ userId, username: username || 'unknown', messageCount: 1, predictionCount: 0 });
    }
  } catch (err) {
    console.error('Ошибка обновления статистики:', err);
  }
};

const saveUserMessage = async ({
  userId,
  chatId,
  messageId,
  text,
  username,
  timestamp,
}: {
  userId: number;
  chatId: number;
  username: string;
  messageId?: number;
  text: string;
  timestamp: Date;
}) => {
  await messagesHistoryCollection.insertOne({
    userId,
    chatId,
    username,
    messageId: messageId || 0,
    text,
    timestamp,
  });
};

export const dbActions = {
  updateUserPredictionCount,
  updateUserMessageCount,
  saveUserMessage,
};
