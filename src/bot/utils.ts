import { CUSTOM_PREDICTIONS, E_USER_WITH_CUSTOM_PREDICTIONS } from '../constants/predictions';

interface IGetCustomPredictionForUserParams {
  predictionCount?: number;
  username: E_USER_WITH_CUSTOM_PREDICTIONS;
}

export const getCustomPredictionForUser = ({ predictionCount, username }: IGetCustomPredictionForUserParams) => {
  if (!predictionCount) {
    return CUSTOM_PREDICTIONS[username][0];
  }

  if (username === E_USER_WITH_CUSTOM_PREDICTIONS.vse_vam_say) {
    const predictionIndexMultipleOfThree = predictionCount / 3;

    if (Number.isInteger(predictionIndexMultipleOfThree) && predictionIndexMultipleOfThree < 5) {
      return CUSTOM_PREDICTIONS[username][predictionIndexMultipleOfThree];
    }
    return undefined;
  }

  const predictionIndexMultipleOfFive = predictionCount / 5;
  if (Number.isInteger(predictionIndexMultipleOfFive) && predictionIndexMultipleOfFive < 2) {
    return CUSTOM_PREDICTIONS[username][predictionIndexMultipleOfFive];
  }
};

export const checkUsernameForCustumPrediction = (username: string) => {
  return Object.keys(CUSTOM_PREDICTIONS).includes(username.toLocaleLowerCase());
};
