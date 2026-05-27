import express from "express"
import { connectDB } from "./db.js"
import dotenv from "dotenv"
import cors from 'cors'
import cookieParser from 'cookie-parser'

import orderRoutes from './routes/order.routes.js'
import productRoutes from './routes/product.route.js'
import adminRoutes from './routes/admin.routes.js'

dotenv.config()

const app = express()

app.use(cookieParser())
app.use(cors({
    origin: ['http://localhost:5173', 'https://ths-gsl.vercel.app'],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}))
app.use(express.json())

const PORT = process.env.PORT || 5000

// Helper function to format phone numbers for Twilio


app.use("/api/order", orderRoutes)
app.use("/api/products", productRoutes)
app.use("/api/admin", adminRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})