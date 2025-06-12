import "dotenv/config";
import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';
import * as commands from './commands';
import { botToken, init, channelID } from './config';
import { userSessions } from './commands/index';
import UserModel from "./config/model";

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
        result = await commands.welcome(chatId, username);
        
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
     console.log('message error -> \n', error)
  }
})

bot.on('callback_query', async (query: CallbackQuery) => {
    const chatId = query.message?.chat.id!
    const msgId = query.message?.message_id!
    const action = query.data!
    const username = query.message?.chat?.username!
    const callbackQueryId = query.id;
    try {
      let result
      if (action.startsWith("answer_")) {
        let currentSession = userSessions.get(username);
        
        const currenSelection = action.split("_")[1];
        let currentIndex = currentSession?.qIndex!;

        if (currenSelection === currentSession?.questions[currentIndex].correct) {
          currentIndex ++;
          
          if (currentIndex <= currentSession?.questions.length - 1) {
            currentSession.qIndex = currentIndex;
            currentSession = userSessions.get(username);
            const title = (currentIndex + 1) + ') ' + currentSession?.questions[currentIndex].question!;
            const content = currentSession?.questions[currentIndex].options.map((opt: string) => [{ text: opt, callback_data: 'answer_' + opt }])!
  
            await bot.sendMessage(
              chatId,
              title, 
              {
                reply_markup: {
                    inline_keyboard: content,
                    force_reply: false, // Disable input field
                },
                parse_mode: 'HTML'
            })
          } else {
            const finalize = await commands.finalize(chatId, username);

            const setDistributionAmt_msg = await bot.sendMessage(chatId, finalize.title,
              {
                reply_markup: {
                    inline_keyboard: finalize.content
                }, parse_mode: 'HTML'
              }
            );
      
            // bot.once(`message`, async (msg) => {
            //   console.log("wallet:", msg.text);
            //   if (msg.text) {
            //     try {
                  
            //       const successMessage = await bot.sendMessage(
            //         chatId, 
            //         `👌 Successfully saved! You did it! You are the G.O.A.T!`,
            //         {
            //           reply_markup: {
            //             inline_keyboard: [
            //               [
            //                 {
            //                   text: '🔔 Join Channel',
            //                   url: `https://t.me/${channelID}`
            //                 }
            //               ]
            //             ],
            //             force_reply: false, // Disable input field
            //           }
            //         }
            //       );
            //     } catch (error) {
            //       console.log("error:", error);
                  
            //       const failedMessage = await bot.sendMessage(chatId, `😒 Save wallet address failed!`);
            //     }
            //   }
            // })
          }
        } else {
          const failedResult = await commands.failedResult(chatId, username);
          
          if (failedResult) {
            const setDistributionAmt_msg = await bot.sendMessage(chatId, failedResult.title, {
              reply_markup: {
                inline_keyboard: failedResult.content
              }, parse_mode: 'HTML'
            } )
          }
        }
      }

      switch (action) {
        case "startquize":
          result = await commands.selectOption(chatId, username, 0);
          await bot.sendMessage(
                chatId,
                result.title, 
                {
                  reply_markup: {
                      inline_keyboard: result.content,
                      force_reply: false, // Disable input field
                  },
                  parse_mode: 'HTML'
            })
          break;
        
        default:
          break;
      }
    } catch (error) {
      console.log('callback query error -> \n', error)
    }
})