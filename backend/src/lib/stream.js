import { StreamChat } from 'stream-chat'
import { ENV } from './env.js'
import { err } from 'inngest/types';
import { use } from 'react';

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Straem API_KEY pr API_SECRET are missing")
}

export const chatClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUsers(userData)
        return userData
    } catch (error) {
        console.error("Error upserting user",error)
    }
}

export const deleteStreamUser = async (userid) => {
    try {
        await chatClient.delete(userid)
        console.log("Strem user deleted successfully",userid)
    } catch (error) {
        console.error("Error upserting user",error)
    }
}