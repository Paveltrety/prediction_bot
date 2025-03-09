import { Filter, UpdateFilter } from 'mongodb';
import { messagesCollection, predictionsCollection } from '../init';
import { IMessagesCollectionModel } from '../types';

const getPredictionsCount = async () => {
  try {
    const count = await predictionsCollection.countDocuments();
    return count;
  } catch (error) {
    return 1;
  }
};

const getPredictionByIndex = async (index: number) => {
  try {
    const randomPrediction = await predictionsCollection.find().skip(index).limit(1).toArray();
    return randomPrediction;
  } catch (error) {
    throw error;
  }
};

export const predictionsCollectionsApi = {
  getPredictionsCount,
  getPredictionByIndex,
};
