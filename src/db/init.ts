import { Collection, Db, MongoClient } from 'mongodb';
import { IMessagesCollectionModel } from './types';

// Глобальные переменные для базы данных и коллекции
export let client: MongoClient;

export let botDb: Db;

export let predictionsCollection: Collection;
export let messagesCollection: Collection<IMessagesCollectionModel>;

const url = 'mongodb://localhost:27017'; // если MongoDB работает локально на порту 27017

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

    //const result = await predictionsCollection.insertMany(
    //  array.map((item, index) => ({
    //    id: index + 75,
    //    date: '05.03.2025',
    //    value: item,
    //  })),
    //);
    //await predictionsCollection.insertMany(
    //[
    //  { id: 125, date: '05.03.2025', value: 'Сегодня потеряешь 300 рублей и будешь весь день голодная' },
    //  { id: 126, date: '05.03.2025', value: 'Придешь за халявной едой в кафе, а тебе насрут в руку' },
    //  { id: 127, date: '05.03.2025', value: 'Решишь сделать колесо, но не сможешь остановиться. Докатишься до Волгограда' },
    //  { id: 128, date: '05.03.2025', value: 'Закинишься снюсом и блюванешь' },
    //  { id: 129, date: '05.03.2025', value: 'На работе дадут премию: 300 рублей и шайбу со снюсом' },
    //  { id: 130, date: '05.03.2025', value: 'Сегодня тебе подарят большой букет. Жаль что венерический' }, // Маша К
    //  { id: 131, date: '05.03.2025', value: 'Соберешь большую вечеринку дома. Кто-то украдет деньги из заначки' }, // Маша К
    //  { id: 132, date: '05.03.2025', value: 'Упадешь с велосипеда в грязь. Опять.' }, // Юра
    //  { id: 133, date: '05.03.2025', value: 'Попадешь под кислотный дождь и облысеешь' }, // Юра
    //  { id: 134, date: '05.03.2025', value: 'Обольешься пока будешь пить пиво' }, // Алла
    //  { id: 135, date: '05.03.2025', value: 'Станешь матерью в этом году' }, // Алла
    //  { id: 136, date: '05.03.2025', value: 'Захочешь послушать музыку, но будет играть только ЛСП' }, // Паша
    //  { id: 137, date: '05.03.2025', value: 'Починишь БМВ. Вечером она сломается снова' }, // Паша
    //  { id: 138, date: '05.03.2025', value: 'Пойдешь на волейбол и получишь мячиком в лоб' }, // Маша Т
    //  { id: 139, date: '05.03.2025', value: 'Будешь долго кататься на мотоцикле и забудешь дорогу до дома' }, // Маша Т
    //  { id: 140, date: '05.03.2025', value: 'Будешь вонять весь день. Впрочем как и всегда' }, // Коробка
    //  { id: 141, date: '05.03.2025', value: 'Потеряешься в торговом центре' }, // Коробка
    //  { id: 142, date: '05.03.2025', value: 'Устроишься на крутую работу. Не пройдешь испыталку' }, // Алена
    //  { id: 143, date: '05.03.2025', value: 'Взломают твой телефон и выложат нюдсы во все паблики' }, // Алена
    //];
    //);
  } catch (err) {
    console.error('Ошибка подключения:', err);
  }
};
