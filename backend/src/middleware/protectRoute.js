import { requireAuth } from '@clerk/express'
import { User } from '../Models/User.js'

export const protectRoute = [
    requireAuth({ signInUrl: "/sign-in" }),
    async (req, res, next) => {
        try {
            const clerkId = req.auth().userId;



            if (!clerkId) {
                console.log("ProtectRoute: No clerkId found in request");
                return res.status(401).json({ msg: "Unauthorized pr invalid token" })
            }

            let user = await User.findOne({ clerkId })
            if (!user) {
                console.log(`ProtectRoute: User not found in DB for clerkId: ${clerkId}`);
                return res.status(404).json({ msg: "User not found" })
            }

            req.user = user
            next();
        } catch (error) {
            console.error("Internal middleware error")
            res.status(500).json({ msg: "Internal server error" })
        }
    },
]