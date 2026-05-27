import { Order } from '../models/order.model.js'

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

export const newOrder = async (req, res) => {
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
        console.log(error)
        return res.status(500).json({ message: "Server Error: Could not process order.", error: error.message })
    }
}
