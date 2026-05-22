import nodemailer from 'nodemailer'
import twilio from 'twilio'
import dotenv from 'dotenv'

dotenv.config()

const twilioClient = twilio(
    process.env.TWILLIO_ACCOUNT_SSID,
    process.env.TWILIO_AUTH_TOKEN
)

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    },
    tls:{
        rejectUnauthorized: false
    },
    connectionTimeout: 10000,
})

export const sendAdminEmailAlerts = async (order) => {
    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: process.env.NOTIFICATION_EMAIL,
        subject: `New Bulk Order Received! - From ${order.buyerName}`,
        html: `
        <h3>New Order Details</h3>
        <p><strong>Customer:</strong> ${order.buyerName}</p>
        <p><strong>Phone:</strong> ${order.phoneNumber}</p>
        <p><strong>Address:</strong> ${order.deliveryAddress}</p>
        <p><strong>Item:</strong> ${order.itemName}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Total Price:</strong> ${order.totalPrice}</p>
        <br />
        <p>Please contact the customer immediately to arrange delivery.</p>
        `
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log("Admin email notifcation sent.")
    } catch (error) {
        console.error("Email failed to send", error)
    }
}

export const sendSMSNotifications = async (order) => {
    const messageBody = `Hello ${order.buyerName}, your order for ${order.quantity} of ${order.itemName} (Total: #${order.totalPrice}) has been received! We will contact you shortly at ${order.phoneNumber} for delivery. Thank you!`
    try {
        await twilioClient.messages.create({
            body: messageBody,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: order.phoneNumber
        })
        console.log("Admin SMS alert sent successfully")
    } catch (error) {
        console.error("SMS failed to send:", error)
    }
}



