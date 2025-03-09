import { Filter, UpdateFilter } from 'mongodb';
import { messagesCollection } from '../init';
import { IMessagesCollectionModel } from '../types';

const getUserInfo = async (userId: number) => {
  try {
    const user = await messagesCollection.findOne({ userId });
    return user;
  } catch (error) {
    return null;
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
};
