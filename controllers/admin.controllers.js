import { Admin } from '../models/admin.model.js'
import bcryptjs from 'bcryptjs'
import { generateTokenAndSetCookies } from '../utils/generateTokenAndSetCookies.js'

export const newAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            throw Error('All fields are required')
        }

        const adminAlreadyExists = await Admin.findOne(email)

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

        res.status(201).json({
            success: true,
            message: "Admin account created",
            admin: {
                ...admin._doc,
                password: undefined
            }
        })


    } catch (error) {
        res.status(500).json{ message: "Error signing up" }
    }
}

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ message: "All fields are required" })
        }

        const admin = await Admin.findOne(email).select("-password")

        if (!admin) {
            res.status(400).json({ message: "Invalid credentials" })
        }

        generateTokenAndSetCookies(res, admin._id)

        res.status(200).json({ admin })
    } catch (error) {
        res.status(500).json({ message: "Error signing in" })
    }
}

export const logout = async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: strict
    })

    res.status(200).json({ success: true, message: "Logged out successfully" })
}