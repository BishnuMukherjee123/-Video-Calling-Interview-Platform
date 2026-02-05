import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_SECRET_KEY;

if (!apiKey || !apiSecret) {
    console.error("STREAM_API_KEY or STREAM_SECRET_KEY is missing");
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret); // will be used for chat features
export const streamClient = new StreamClient(apiKey, apiSecret); // will be used for video calls

export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData)
        console.log("Stream user upserted succcessfullly: ", userData);
    } catch (error) {
        console.error("Error upserting Stream user: ", error)
    }
}

export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUser(userId)
        console.log("Stream user deleted succcessfullly: ", userId);
    } catch (error) {
        console.error("Error upserting Stream user: ", error)
    }
}

// todo: anither method to generate token

