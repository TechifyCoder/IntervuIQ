import { StreamChat } from 'stream-chat'
import { StreamClient } from '@stream-io/node-sdk'
import { ENV } from './env.js'

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if(!apiKey || !apiSecret){
    console.error("Straem API_KEY pr API_SECRET are missing")
}

export const chatClient = StreamChat.getInstance(apiKey,apiSecret);
export const straemClient = new StreamClient(apiKey,apiSecret)

export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData)
        console.log("Stream user upserted successfully:", userData);
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