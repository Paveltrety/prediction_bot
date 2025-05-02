import { messagesCollectionsApi } from './api/messagesCollectionsApi';
import { messagesChunksCollection, messagesHistoryCollection } from './initDB';
import { ISaveUserMessageParams, ITryCreateChunkForUserParams } from './types';
import { openAI } from '../openAI/initOpenAI';

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

const saveUserMessage = async ({ userId, chatId, messageId, text, username, timestamp }: ISaveUserMessageParams) => {
  await messagesHistoryCollection.insertOne({
    userId,
    chatId,
    username,
    messageId: messageId || 0,
    text,
    timestamp,
  });
};

const tryCreateChunkForUser = async (params: ITryCreateChunkForUserParams) => {
  const { username, userId, chatId, chunkSize = 50 } = params;
  const unprocessedMessages = await messagesHistoryCollection.find({ userId, chatId }).sort({ timestamp: 1 }).limit(chunkSize).toArray();

  if (unprocessedMessages.length < chunkSize) {
    return;
  } // ещё рано

  const text = unprocessedMessages.map((m) => m.text).join('\n');

  const from = unprocessedMessages[0].timestamp;
  const to = unprocessedMessages[unprocessedMessages.length - 1].timestamp;

  await messagesChunksCollection.insertOne({
    username,
    userId,
    chatId,
    from,
    to,
    text,
    createdAt: new Date(),
  });

  const ids = unprocessedMessages.map((m) => m._id);
  await messagesHistoryCollection.deleteMany({ _id: { $in: ids } });
};

const generateAIPrediction = async (text: string) => {
  try {
    const completion = await openAI.chat.completions.create({
      model: 'deepseek/deepseek-chat-v3-0324:free',
      messages: [
        {
          role: 'system',
          content:
            "Ты шуточный астролог с грубым и пошлым юмором. Вот пример твоих предсказаний на день: \'Устроишься на крутую работу. Не пройдешь испыталку\', \'Взломают твой телефон и выложат нюдсы во все паблики\', \'Придешь за халявной едой в кафе, а тебе насрут в руку\', \'Сегодня тебе подарят большой букет. Жаль что венерический\'. На основе сообщений, который писал юзер в чат ты должен придумать колкое и смешное предсказание. Предсказание не должно быть длинным. В твоем ответе должна быть только строка с предсказанием и все.",
        },
        { role: 'user', content: `Вот такие сообщения писал пользовтаель: ${text}` },
      ],
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    return '';
  }
};

export const dbActions = {
  updateUserPredictionCount,
  updateUserMessageCount,
  saveUserMessage,
  tryCreateChunkForUser,
  generateAIPrediction,
};
