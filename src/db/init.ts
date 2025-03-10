import { Collection, Db, MongoClient } from 'mongodb';
import { IMessagesCollectionModel } from './types';

// Глобальные переменные для базы данных и коллекции
export let client: MongoClient;

export let botDb: Db;

export let predictionsCollection: Collection;
export let messagesCollection: Collection<IMessagesCollectionModel>;

const url = `mongodb://${process.env.SERVER_IP}:27017`; // если MongoDB работает локально на порту 27017

const botDbName = 'bot_db'; // замените на имя вашей базы данных
const predictionsCollectionName = 'predictions'; // имя коллекции с предсказаниями

const messagesCollectionName = 'messages'; // имя коллекции с предсказаниями

// Функция для инициализации базы данных
export const initializeDatabase = async () => {
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
  } catch (err) {
    console.error('Ошибка подключения:', err);
  }
};
