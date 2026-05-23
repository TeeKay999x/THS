import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ['vegetables', 'gas', 'spices', 'tubers', 'grains'] },
    image: { type: String, required: true }, // URL string for the product image
    options: [
        {
            tier: { type: String, required: true }, // e.g., "12.5kg Refill" or "10kg Basket"
            price: { type: Number, required: true }  // e.g., 14000
        }
    ],
    isAvailable: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

export const Product = mongoose.model("Product", ProductSchema)