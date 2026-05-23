import express from "express"
import { connectDB } from "./db.js"
import dotenv from "dotenv"
import cors from 'cors'
import { Order } from "./order.model.js"
import { Product } from "./product.model.js"
import { sendAdminEmailAlerts, sendSMSNotifications } from "./services/notificationService.js"


dotenv.config()

const app = express()

app.use(cors({
    origin: ['http://localhost:5173', 'https://ths-gsl.vercel.app']
}))
app.use(express.json())

const PORT = process.env.PORT || 5000

// Helper function to format phone numbers for Twilio
const formatNigerianNumber = (number) => {
    let cleanNumber = number.replace(/\s+/g, '');
    if (cleanNumber.startsWith('0')) {
        return '+234' + cleanNumber.substring(1);
    }
    if (cleanNumber.startsWith('8') || cleanNumber.startsWith('7') || cleanNumber.startsWith('9')) {
        return '+234' + cleanNumber;
    }
    if (cleanNumber.startsWith('234')) {
        return '+' + cleanNumber;
    }
    return cleanNumber;
};

app.post("/api/orders", async (req, res) => {
    try {
        const { itemName, quantity, totalPrice, buyerName, phoneNumber, deliveryAddress } = req.body
        const formattedPhoneNumber = formatNigerianNumber(phoneNumber)

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

        try {
            await sendAdminEmailAlerts(savedOrder)
            console.log("Admin email alert processed.")
        } catch (emailError) {
            console.error("Email failed to send, moving directly to SMS:", emailError.message)
        }
        if (savedOrder.phoneNumber) {
            savedOrder.phoneNumber = formatNigerianNumber(savedOrder.phoneNumber)
        }

        try {
            await sendSMSNotifications(savedOrder)
            console.log("Admin SMS alert processed")
        } catch (smsError) {
            console.error("SMS system error:", smsError.message)
        }


        return res.status(201).json({ success: true, order: savedOrder })
    } catch (error) {
        return res.status(500).json({ message: "Server Error: Could not process order.", error: error.message })
        console.log(error)
    }
})

app.post("/api/products", async (req, res) => {
    try {
      // 1. Extract the secret key from the request headers
      const adminKey = req.headers['x-admin-key'];
  
      // 2. Validate the key against your production environment variable
      if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json({ 
          success: false, 
          message: "Unauthorized: Access denied. Invalid secret key." 
        });
      }
  
      // 3. Extract product info from the request body
      console.log("Authorized access. Adding product to DB:", req.body);
      const { itemName, quantity, totalPrice, isAvailable } = req.body;
  
      // Basic validation
      if (!itemName || totalPrice === undefined) {
        return res.status(400).json({ 
          success: false, 
          message: "Item name and price are required fields." 
        });
      }
  
      // 4. Create and save the new product instance
      const newProduct = new Product({
        itemName,
        quantity: quantity || 0,
        totalPrice,
        isAvailable: isAvailable !== undefined ? isAvailable : true
      });
  
      const savedProduct = await newProduct.save();
      
      return res.status(201).json({ 
        success: true, 
        product: savedProduct 
      });
  
    } catch (error) {
      console.error("Product upload failure:", error.message);
      return res.status(500).json({ 
        success: false, 
        message: "Server Error: Could not save product.", 
        error: error.message 
      });
    }
  });

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