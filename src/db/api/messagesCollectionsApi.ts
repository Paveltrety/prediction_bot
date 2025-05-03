import { Filter, UpdateFilter } from 'mongodb';
import { messagesCollection } from '../initDB';
import { IMessagesCollectionModel } from '../types';

const getUserInfo = async (userId: number) => {
  try {
    const user = await messagesCollection.findOne({ userId });
    return user;
  } catch (error) {
    return null;
  }
};

const getTopUsers = async (limit: number | undefined = 10) => {
  try {
    const topUsers = await messagesCollection
      .find({})
      .sort({ messageCount: -1 }) // сортируем по убыванию
      .limit(limit)
      .toArray();
    return topUsers;
  } catch (error) {
    return [];
  }
};

const createUser = async (data: IMessagesCollectionModel) => {
  try {
    await messagesCollection.insertOne(data);
  } catch (error) {
    throw error;
  }
};

const updateUserInfo = async (filter: Filter<IMessagesCollectionModel>, newData: UpdateFilter<IMessagesCollectionModel>) => {
  try {
    await messagesCollection.updateOne(filter, newData);
  } catch (error) {
    throw error;
  }
};

export const messagesCollectionsApi = {
  getUserInfo,
  createUser,
  updateUserInfo,
  getTopUsers,
};
