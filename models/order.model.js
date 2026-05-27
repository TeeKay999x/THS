import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    buyerName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Order = mongoose.model("Order", orderSchema)