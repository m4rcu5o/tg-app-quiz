import dotenv from "dotenv";
import { connectMongoDB } from "./db";

dotenv.config();
export const init = async () => {
    connectMongoDB()
}

export const questionAmount = 2;
export const hardAmount = 2;
export const ultra = 2
export const impossibleAmount = 8;
export const channelID = "xxx"
export const isTest = false;

export const botToken = process.env.BOT_TOKEN!
export const mongoUrl = process.env.MONGO_URI!