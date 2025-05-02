import OpenAI from 'openai';

export let openAI: OpenAI;

export const initializeOpenAI = async (openAIKey: string) => {
  try {
    openAI = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openAIKey,
    });
  } catch (err) {
    console.error('Ошибка подключения:', err);
  }
};
