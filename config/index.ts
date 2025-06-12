import dotenv from "dotenv";
import { connectMongoDB } from "./db";

dotenv.config();
export const init = async () => {
    connectMongoDB()
}

export const botToken = process.env.BOT_TOKEN!
export const mongoUrl = process.env.MONGO_URI!