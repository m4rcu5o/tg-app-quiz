import "dotenv/config";
import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import * as commands from './commands'
import { botToken, init } from './config'

const token = botToken
const bot = new TelegramBot(token!, { polling: true });
let botName: string
let editText: string

console.log("Bot started");

bot.getMe().then(user => {
    botName = user.username!.toString()
    console.log("botname", botName)
})

bot.setMyCommands(commands.commandList);

init()

bot.on('message', async (msg) => {
  const chatId = msg.chat.id!
  const text = msg.text!
  const msgId = msg.message_id!
  const username = msg.from!.username!
  if (text) console.log(`message : ${chatId} -> ${text}`)
  else return

  try {
    let result
    switch (text) {
      case "/start":
        result = await commands.welcome(chatId, username)
        await bot.sendMessage(
            chatId,
            result.title, 
            {
              reply_markup: {
                  inline_keyboard: result.content
              }, parse_mode: 'HTML'
            }
        )
        break;
    
      default:
        await bot.deleteMessage(chatId, msgId)
    }
  } catch (error) {
     console.log('error -> \n', error)
  }
})

bot.on('callback_query', async (query: CallbackQuery) => {
    const chatId = query.message?.chat.id!
    const msgId = query.message?.message_id!
    const action = query.data!
    const username = query.message?.chat?.username!
    const callbackQueryId = query.id;

    
})