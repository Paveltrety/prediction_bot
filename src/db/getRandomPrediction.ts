import { predictionsCollectionsApi } from './api/predictionsCollectionsApi';
import { predictionsCollection } from './init';

export const getRandomPrediction = async () => {
  if (!predictionsCollection) {
    return 'Ошибка в подключении к базе данных';
  }

  const count = await predictionsCollectionsApi.getPredictionsCount();
  const randomIndex = Math.floor(Math.random() * count);

  const randomPrediction = await predictionsCollectionsApi.getPredictionByIndex(randomIndex);
  return randomPrediction?.[0]?.value || 'Ошибка в получении предсказания';
};
