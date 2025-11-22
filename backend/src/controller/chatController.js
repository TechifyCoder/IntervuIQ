import { chatClient } from "../lib/stream.js";

export const getStraemzToken = async (req,res) => {
    try {
        const token = chatClient.createToken(req.user.clerkId)
        res.status(200).json({
            token,
            userId: req.user.clerkId,
            userName: req.user.name,
            userImage: req.user.image,
        })
    } catch (error) {
        console.error("Internal getStream error")
        res.status(500).json({msg:"Internal server error"})
    }
}