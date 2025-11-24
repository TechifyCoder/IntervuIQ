import { chatClient, straemClient } from "../lib/stream.js";
import Session from "../Models/Session.js"


export const createSession = async(req,res) => {
    try {
        const { problem,difficulty } = req.body
        const userId = req.user._id;
        const clerkId = req.user.clerkId;

        if(!problem || !difficulty){
            return res.status(400).json({msg:"problem and difficulty are required"})
        }
        const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const session = await Session.create({problem,difficulty,host:userId,callId});

        // video Straeming
        await straemClient.video.call("default",callId).getOrCreate({
            data:{
                created_by_id:clerkId,
                custom: {problem,difficulty,sessionId:session._id.toString()},
            },
        })

        //chat messaging
        const channel = chatClient.channel("messaging",callId,{
            name: `${problem} Session`,
            created_by_id:clerkId,
            members:[clerkId]
        })
    
        await channel.create();

        res.status(201).json({session:session})
    } catch (error) {
        console.error("Internal createSession error")
        res.status(500).json({msg:"Internal server error"})        
    }
}

export const getActiveSession = async(_,res) => {
    try {
        const sessions = await Session.find({status:"active"})
         // get the host id and show: name profileImage email clerkId come from User Model
        .populate("host","name profileImage email clerkId")  
        .sort({createdAt: -1})
        .limit(20);

        res.status(200).json({sessions})
    } catch (error) {
        console.error("Internal getActiveSession error")
        res.status(500).json({msg:"Internal server error"})          
    }
}

export const getMyPastSession = async(req,res) => {}

export const getSessionById = async(req,res) => {}

export const joinSession = async(req,res) => {}

export const endSession = async(req,res) => {}