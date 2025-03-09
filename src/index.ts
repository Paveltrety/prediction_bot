import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';
import { initializeDatabase } from './db/init';
import { botHandlers } from './bot/handlers/botHandlers';

config();

initializeDatabase();

export const bot = new TelegramBot(process.env.BOT_TOKEN!, { polling: true });

bot.on('inline_query', botHandlers.onInlineQuery);

bot.on('message', botHandlers.onMessage);
