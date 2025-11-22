import express from 'express'
import { getStraemzToken } from '../controller/chatController.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.get('/token',protectRoute,getStraemzToken)

export default router