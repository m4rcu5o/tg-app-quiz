import * as helper from "./helper"

export const commandList = [
    { command: 'start', description: 'Start the bot' },
];

export const welcome = async (chatId: number, username?: string) => {
    const userInfo = await helper.findOfUser(chatId, username);

    const title = `👨‍💻 GM fren, I'm FU! I have a gift for you, but first, you need to prove yourself by answering 8 questions correctly. Good luck!`
    const content = [
        [{ text: 'Start Quiz 😉', callback_data: 'startquize' }],
        [{ text: 'Visit Community 🚀', callback_data: 'visitcommunity' }]
    ]
   
    return { title, content }
}