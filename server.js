import express from "express"
import { connectDB } from "./db.js"
import dotenv from "dotenv"
import cors from 'cors'
import { Order } from "./order.model.js"
import {Product} from "./product.model.js"
import { sendAdminEmailAlerts, sendSMSNotifications } from "./services/notificationService.js"


dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())
const PORT = process.env.PORT || 5000

app.post("/api/orders", async (req, res) => {
    try {
        console.log("incomig data:", req.body)
        const { itemName, quantity, totalPrice, buyerName, phoneNumber, deliveryAddress } = req.body

        if (!itemName || !quantity || !totalPrice || !buyerName || !phoneNumber || !deliveryAddress) {
            throw new Error("All fields are required")
        }

        const newOrder = new Order({
            itemName,
            quantity,
            totalPrice,
            buyerName,
            phoneNumber,
            deliveryAddress
        })

        const savedOrder = await newOrder.save()

        sendAdminEmailAlerts(savedOrder)
        sendSMSNotifications(savedOrder)

        return res.status(201).json({ success: true, order: savedOrder })
    } catch (error) {
        return res.status(500).json({ message: "Server Error: Could not process order.", error: error.message })
        console.log(error)
    }
})

app.get('/api/products', async (req, res) => {
    try {
      const products = await Product.find({ isAvailable: true }).sort({ createdAt: -1 });
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})