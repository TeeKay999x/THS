import { Admin } from '../models/admin.model.js'
import bcryptjs from 'bcryptjs'
import { generateTokenAndSetCookies } from '../utils/generateTokenAndSetCookies.js'

export const newAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        // 🎯 FIX: Wrapped query string in an object descriptor
        const adminAlreadyExists = await Admin.findOne({ email })

        if (adminAlreadyExists) {
            return res.status(400).json({ message: "Admin already exists" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        const admin = new Admin({
            name,
            email,
            hashedPassword
        })

        generateTokenAndSetCookies(res, admin._id)
        await admin.save() // 🎯 FIX: Explicitly save the administrator to the database

        return res.status(201).json({
            success: true,
            message: "Admin account created",
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email
            }
        })

    } catch (error) {
        console.error("Signup error:", error.message)
        return res.status(500).json({ message: "Error signing up" })
    }
}

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // 🎯 FIX: Removed .select("-password") so bcrypt can see the hash
        const admin = await Admin.findOne({ email })

        if (!admin) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        // 🎯 FIX: Add bcrypt confirmation challenge logic
        const isMatch = await bcryptjs.compare(password, admin.hashedPassword)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        generateTokenAndSetCookies(res, admin._id)

        return res.status(200).json({ 
            success: true,
            admin: {
                _id: admin._id,
                name: admin.name,
                email: admin.email
            }
        })
    } catch (error) {
        console.error("Login error:", error.message)
        return res.status(500).json({ message: "Error signing in" })
    }
}

export const logout = async (req, res) => {
    // 🎯 FIX: Added string quotes to 'strict'
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    })

    return res.status(200).json({ success: true, message: "Logged out successfully" })
}