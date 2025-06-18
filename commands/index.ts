import * as helper from "./helper"
import { getRandomQuestions } from "../util";
import { questionsDB } from "../config/question";
import UserModel from "../config/model";
import { channelID, isTest } from "../config";
import dotenv from "dotenv";

dotenv.config();

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
    let chance = 2;
    if (userInfo) {
        chance = userInfo.chance;
    }
    let title = `🎯 Welcome to the Quiz Challenge!
    
Test your knowledge with 8 exciting questions!
You have 2 chances to complete the quiz:

✅ First mistake? You’ll start over from question 1.
❌ Second mistake? Game over.

💯 Score a perfect 8/8 to unlock a special surprise!

Ready to play? Let’s go! 🚀`;

    let content = [
        [{ text: `Start Quiz 😉. You have got ${chance <= 0? 0 : chance } chance`, callback_data: 'startquize' }],
        [{ text: 'Visit Community 🚀', url: `https://t.me/${channelID}` }]
    ]

    console.log("isTest", !isTest);
    if (!isTest && userInfo?.chance != undefined && userInfo?.chance <= 0) {  
        
        if (userInfo?.result === 1 && !userInfo?.isMulti) {
            console.log("return here 1");
            
            return { title, content }
        }
        title = `👨‍💻 You are not able to play game`;
        content.shift();
    }
    console.log("return here 2");
   
    return { title, content }
}

export const finalize = async (chatId: number, username: string) => {
    const userInfo = await helper.findOfUser(chatId, username);
    deleteSession(username);

    let title = `🎁 Congretulation!`;
    let content = [
        [{ text: 'Enter address 🏆', callback_data: 'enteraddress' }],
    ]

    if (!userInfo) {
        const data = new UserModel({
            userId: chatId,
            username: username,
            chance: 0,
            result: 1
        });

        await data.save();
        content.push([{ text: '2x allocation 🚀', callback_data: 'startquize' }]);
    } else if (userInfo.result === 1) {
        userInfo.result = 2;
        userInfo.chance = 0;
        await userInfo.save()
    } else if (userInfo.result === 0) {
        userInfo.result = 1;
        userInfo.chance = 0;
        await userInfo.save();
    }
   
    return { title, content }
}

export const failedResult = async (chatId: number, username: string) => {
    deleteSession(username);

    const sessionIndex = userSessions.get(username)?.qIndex;
    const userInfo = await helper.findOfUser(chatId, username);

    let title = `😒 Game over! Finished ${sessionIndex} / 8 Questions`;
    let content = [
        [{ text: 'Enter address 🏆', callback_data: 'enteraddress' }],
    ]

    let visiteMsg = [
        [{ text: 'Visit Community 🚀', url: `https://t.me/${channelID}` }],
        [{ text: 'Try again 🚀', callback_data: 'startquize' }]
    ];
    
    if (!userInfo) {
        const data = new UserModel({
            userId: chatId,
            username: username,
            chance: 1,
            result: 0
        });

        await data.save();
        return { title, content: visiteMsg }

    } else if (userInfo.result === 1) {
        
        userInfo.isMulti = true;
        let chance = userInfo.chance - 1; 
        userInfo.chance = chance; 
        await userInfo.save()
        if (chance > 0) {
            content.push([{ text: 'Try again 🚀', callback_data: 'startquize' }])
        }
        return { title, content }
    } else if (userInfo.result === 0) {
        let chance = userInfo.chance - 1; 
        userInfo.chance = chance; 
        await userInfo.save()
        if (chance === 0) {
            visiteMsg.pop();
        }
        
        return { title, content: visiteMsg }
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
    const content = questions[0].options.map((opt: string, index: number) => [{ text: opt, callback_data: 'answer_' + (index + 1) }]);
    return { title, content }
}

export const deleteSession = (username: string) => {
    const currentSession = userSessions.get(username);

    if (currentSession) {
        userSessions.delete(username);
        console.log("deleted session: @", username);
        
    }
}