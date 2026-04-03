import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../Models/Session.js"


export const createSession = async (req, res) => {
    try {
        const { problem, difficulty } = req.body;
        const userId = req.user._id;
        const clerkId = req.user.clerkId;   // ab ye undefined nahi hoga

        if (!problem || !difficulty) {
            return res.status(400).json({ msg: "problem and difficulty are required" });
        }

        const callId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const session = await Session.create({
            problem,
            difficulty,
            host: userId,
            participant: null,
            callId,
            status: "active"
        });

        // Stream Video Call
        await streamClient.video.call("default", callId).getOrCreate({
            data: {
                created_by_id: clerkId,
                custom: {
                    problem,
                    difficulty,
                    sessionId: session._id.toString()
                }
            }
        });

        // Stream Chat Channel
        const channel = chatClient.channel("messaging", callId, {
            name: `${problem} - ${difficulty}`,
            created_by_id: clerkId,
            members: [clerkId]
        });
        await channel.create();


        // createSession ke end mein
        res.status(201).json({
            success: true,
            session
        });
    } catch (error) {
        console.error("createSession error:", error.message);
        res.status(500).json({ msg: "Failed to create session", error: error.message });
    }
};

export const getActiveSession = async (_, res) => {
    try {
        const sessions = await Session.find({ status: "active" })
            // get the host id and show: name profileImage email clerkId come from User Model
            .populate("host", "name profileImage email clerkId")
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ sessions })
    } catch (error) {
        console.error("Internal getActiveSession error")
        res.status(500).json({ msg: "Internal server error" })
    }
}

export const getMyPastSession = async (req, res) => {
    try {
        const userId = req.user._id;

        const sessions = await Session.find({
            status: "completed",
            $or: [
                { host: userId },
                { participant: userId }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(20)
            .populate("host", "name profileImage email clerkId")
            .populate("participant", "name profileImage email clerkId");

        res.status(200).json({ sessions });
    } catch (error) {
        console.error("Error in getMyPastSession:", error.message);
        res.status(500).json({ msg: "Internal server error" });
    }
}
export const getSessionById = async (req, res) => {
    try {
        const { id } = req.params
        const session = await Session.findById(id)
            .populate("host", "name email profileImage clerkId")           // ← quotes mein
            .populate("participant", "name email profileImage clerkId")   // ← quotes mein

        if (!session) return res.status(400).json({ msg: "Session not found" })

        res.status(200).json({ session })
    } catch (error) {
        console.error("Internal getSessionById error")
        res.status(500).json({ msg: "Internal server error" })
    }
}

export const joinSession = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id
        const clerkId = req.user.clerkId

        const sessions = await Session.findById(id)
        if (!sessions) return res.status(400).json({ msg: "Session not found" })

        if (sessions.status !== "active") {
            return res.status(400).json({ message: "Cannot join a completed session" });
        }

        if (sessions.host.toString() === userId.toString()) {
            return res.status(400).json({ message: "Host cannot join their own session as participant" });
        }

        // cehck the session already full - has a partisepent
        if (sessions.participant) return res.status(409).json({ msg: "Session is full" })

        sessions.participant = userId
        await sessions.save();

        const channel = chatClient.channel("messaging", sessions.callId)
        await channel.addMembers([clerkId])

        res.status(200).json({ sessions })
    } catch (error) {
        console.error("Internal joinSession error")
        res.status(500).json({ msg: "Internal server error" })
    }
}

export const endSession = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.user._id

        const sessions = await Session.findById(id)
        if (!sessions) return res.status(400).json({ msg: "Session not found" })

        if (sessions.host.toString() !== userId.toString()) {
            res.status(403).json({ msg: "only host can be session ended" })
        }

        if (sessions.status === "completed") {
            res.status(400).json({ msg: "Session is already completed" })
        }

        const call = streamClient.video.call('default', sessions.callId)
        await call.delete({ hard: true });

        const chat = chatClient.channel('messaging', sessions.callId)
        await chat.delete();

        sessions.status = "completed"
        await sessions.save();

        res.status(200).json({ sessions })

    } catch (error) {
        console.error("Internal endSession error")
        res.status(500).json({ msg: "Internal server error" })
    }
}