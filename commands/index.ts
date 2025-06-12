import * as helper from "./helper"
import { getRandomQuestions } from "../util";
import { questionsDB } from "../config/question";
import UserModel from "../config/model";
import { channelID } from "../config";

type Session = {
  qIndex: number;
  questions: typeof questionsDB;
  ultra?: boolean;
};

export const userSessions = new Map<string, Session>();

export const commandList = [
    { command: 'start', description: 'Start the bot' },
];

export const welcome = async (chatId: number, username?: string) => {
    const userInfo = await helper.findOfUser(chatId, username);

    let title = `👨‍💻 GM fren, I'm FU! I have a gift for you, but first, you need to prove yourself by answering 8 questions correctly. Good luck!`;
    let content = [
        [{ text: 'Start Quiz 😉', callback_data: 'startquize' }],
        [{ text: 'Visit Community 🚀', url: `https://t.me/${channelID}` }]
    ]

    if (userInfo) {
        title = `👨‍💻 GM fren, Welcome to our community`;
        content.shift();
    }
   
    return { title, content }
}

export const finalize = async (chatId: number, username?: string) => {
    const userInfo = await helper.findOfUser(chatId, username);

    let title = `🎁 Congretulation!`;
    let content = [
        [{ text: 'Enter address 🏆', callback_data: 'enteraddress' }],
    ]

    if (!userInfo) {
        const data = new UserModel({
            userId: chatId,
            username: username,
            result: 1
        });

        await data.save();
        content.push([{ text: '2x allocation 🚀', callback_data: 'startquize' }]);
    } else if (userInfo.result === 1) {
        userInfo.result = 2;
        await userInfo.save()
    }
   
    return { title, content }
}

export const failedResult = async (chatId: number, username?: string) => {
    const userInfo = await helper.findOfUser(chatId, username);

    let title = `😒 You failed!`;
    let content = [
        [{ text: 'Enter address 🏆', callback_data: 'enteraddress' }],
    ]

    let visiteMsg = [[{ text: 'Visit Community 🚀', url: `https://t.me/${channelID}` }]];

    if (!userInfo) {
        const data = new UserModel({
            userId: chatId,
            username: username,
            result: 0
        });

        await data.save();
        return { title, content: visiteMsg }

    } else if (userInfo.result === 1) {
        userInfo.isMulti = true;
        await userInfo.save()
        return { title, content }
    }
}

export const selectOption = async (chatId: number, username: string, index: number) => {
    const userInfo = await helper.findOfUser(chatId, username);
    let is2x = false;

    if (userInfo?.result === 1) {
        is2x = true
    }

    const questions = getRandomQuestions(questionsDB, is2x);
    userSessions.set(username, { qIndex: index, questions });
    const title = (index + 1) + `) ` + questions[0].question;
    const content = questions[0].options.map((opt: string) => [{ text: opt, callback_data: 'answer_' + opt }])
    return { title, content }
}