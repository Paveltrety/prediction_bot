import TelegramBot, { InlineQueryResultArticle } from 'node-telegram-bot-api';
import { messagesChunksCollection } from '../../db/initDB';
import { getRandomPrediction } from '../../db/getRandomPrediction';
import { dbActions } from '../../db/actions';
import { bot } from '../..';
import { DEFAULT_USERNAME } from '../../constants/common';
import { messagesCollectionsApi } from '../../db/api/messagesCollectionsApi';

const onInlineQuery = async (query: TelegramBot.InlineQuery) => {
  const { id: messageId, from, query: userQuery } = query;
  const { id, username } = from;

  if (!userQuery) {
    const user = messagesCollectionsApi.getUserInfo(id);
    const messagesChunksUser = await messagesChunksCollection.findOne({ userId: id });
    let prediction: string | undefined;
    let isHasPredictionAI: boolean = false;

    if (messagesChunksUser?.text) {
      prediction = await dbActions.generateAIPrediction(messagesChunksUser?.text);
      isHasPredictionAI = true;
    }

    if (!prediction) {
      prediction = await getRandomPrediction();
    }

    const result: InlineQueryResultArticle[] = [
      {
        type: 'article',
        id: messageId, // Уникальный id для ответа
        title: 'Получить предсказание',
        description: 'Узнай свое будущее, крендель',
        input_message_content: {
          message_text: `@${username}, твое предсказание:\n\n${prediction}`,
        },
      },
    ];

    await dbActions.updatePredictionInfoForUser({
      isHasUserInfo: !!user,
      userId: id,
      username,
      predictionAI: isHasPredictionAI ? prediction : undefined,
    });
    bot.answerInlineQuery(messageId, result, { cache_time: 0 });
  }
};

const onMessage = async (msg: TelegramBot.Message) => {
  if (msg.hasOwnProperty('via_bot')) {
    return;
  }

  const userId = msg.from?.id;
  const username = msg.from?.username;
  const text = msg.text;
  const chatId = msg.chat.id;

  if (username === 'paveltrety' && text === 'Бот, покажи статистику') {
    const topUsers = await messagesCollectionsApi.getTopUsers(10);

    let message = '*Топ-10 пользователей по количеству сообщений:*\n\n';

    topUsers.forEach((user, index) => {
      message += `${index + 1}. *${user.username}* — ${user.messageCount} сообщений\n`;
    });

    bot.sendMessage(msg.chat.id, message, { parse_mode: 'Markdown' });
  }

  const user = messagesCollectionsApi.getUserInfo(userId || 0);

  if (userId && text) {
    await dbActions.updateUserMessageCount({ isHasUserInfo: !!user, userId, username });

    await dbActions.saveUserMessage({
      userId,
      chatId,
      username: username || DEFAULT_USERNAME,
      messageId: msg.message_id,
      text,
      timestamp: new Date(msg.date * 1000),
    });

    await dbActions.tryCreateChunkForUser({ username: username || DEFAULT_USERNAME, userId, chatId });
  }
};

export const botHandlers = {
  onInlineQuery,
  onMessage,
};
