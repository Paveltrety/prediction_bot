import TelegramBot, { InlineQueryResultArticle } from 'node-telegram-bot-api';
import { messagesCollection } from '../../db/init';
import { checkUsernameForCustumPrediction, getCustomPredictionForUser } from '../utils';
import { E_USER_WITH_CUSTOM_PREDICTIONS } from '../../constants/predictions';
import { getRandomPrediction } from '../../db/getRandomPrediction';
import { dbActions } from '../../db/actions';
import { bot } from '../..';

const onInlineQuery = async (query: TelegramBot.InlineQuery) => {
  const { id: messageId, from, query: userQuery } = query;
  const { id, username } = from;

  if (!userQuery) {
    const user = await messagesCollection.findOne({ userId: id });

    let prediction: string | undefined;

    if (username && checkUsernameForCustumPrediction(username)) {
      prediction = getCustomPredictionForUser({
        predictionCount: user?.predictionCount,
        username: username as E_USER_WITH_CUSTOM_PREDICTIONS,
      });
    }

    if (!prediction) {
      prediction = await getRandomPrediction();
    }

    const result: InlineQueryResultArticle[] = [
      {
        type: 'article',
        id: messageId, // Уникальный id для ответа
        title: 'Получить предсказание',
        description: 'Узнай свое будущее, лох',
        input_message_content: {
          message_text: `@${username}, твое предсказание:\n\n ${prediction}`,
        },
      },
    ];

    await dbActions.updateUserPredictionCount({ isHasUserInfo: !!user, userId: id, username });
    bot.answerInlineQuery(messageId, result, { cache_time: 0 });
  }
};

const onMessage = async (msg: TelegramBot.Message) => {
  if (msg.hasOwnProperty('via_bot')) {
    return;
  }

  const userId = msg.from?.id;
  const username = msg.from?.username;

  const user = await messagesCollection.findOne({ userId });

  if (userId) {
    await dbActions.updateUserMessageCount({ isHasUserInfo: !!user, userId, username });
  }
};

export const botHandlers = {
  onInlineQuery,
  onMessage,
};
