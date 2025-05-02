import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import { initializeDatabase } from './db/initDB';
import { botHandlers } from './bot/handlers/botHandlers';
import { initializeOpenAI } from './openAI/initOpenAI';

config();

const bdUrl = `mongodb://${process.env.BD_USER}:${process.env.BD_PASSWORD}@${process.env.SERVER_IP}:27017?authSource=admin`;

initializeDatabase(bdUrl);

initializeOpenAI(process.env.OPEN_AI_TOKEN!);

export const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: true });

bot.on('inline_query', botHandlers.onInlineQuery);

bot.on('message', botHandlers.onMessage);
