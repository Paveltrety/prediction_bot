import { Collection, Db, MongoClient } from 'mongodb';
import { IMessagesHistoryCollectionModel, IMessagesCollectionModel, IMessagesChunksCollectionModel } from './types';

// Глобальные переменные для базы данных и коллекции
export let client: MongoClient;

export let botDb: Db;

export let predictionsCollection: Collection;
export let messagesCollection: Collection<IMessagesCollectionModel>;
export let messagesHistoryCollection: Collection<IMessagesHistoryCollectionModel>;
export let messagesChunksCollection: Collection<IMessagesChunksCollectionModel>;

const botDbName = 'bot_db'; // замените на имя вашей базы данных
const predictionsCollectionName = 'predictions'; // имя коллекции с предсказаниями

const messagesCollectionName = 'messages'; // имя коллекции с предсказаниями
const messagesHistoryCollectionName = 'messagesHistory'; // имя коллекции, в которой хранятся все сообщения
const messagesChunksCollectionName = 'messagesChunks'; // имя коллекции, в которой хранятся сообщения по чанкам

// Функция для инициализации базы данных
export const initializeDatabase = async (url: string) => {
  try {
    // Закрываем предыдущее подключение, если оно существует
    if (client) {
      await client.close();
    }

    // Создаем новое подключение к базе данных
    client = new MongoClient(url, {});
    await client.connect();
    console.log('Подключено к базе данных MongoDB');

    // Получаем доступ к базе данных и коллекции
    botDb = client.db(botDbName);

    predictionsCollection = botDb.collection(predictionsCollectionName);
    messagesCollection = botDb.collection(messagesCollectionName);
    messagesHistoryCollection = botDb.collection(messagesHistoryCollectionName);
    messagesChunksCollection = botDb.collection(messagesChunksCollectionName);
  } catch (err) {
    console.error('Ошибка подключения:', err);
  }
};
