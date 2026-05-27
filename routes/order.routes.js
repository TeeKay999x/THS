import express from 'express'
import { newOrder } from '../controllers/order.controllers.js'

const router = express.Router()

router.post("/", newOrder)

export default router