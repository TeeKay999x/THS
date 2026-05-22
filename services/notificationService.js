import { Resend } from 'resend';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// 1. INITIALIZE RESEND (For API-based Emails)
const resend = new Resend(process.env.RESEND_API_kEY);

// 2. INITIALIZE TWILIO (For SMS)
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ==========================================
// 📩 RESEND EMAIL NOTIFICATION SERVICE
// ==========================================
export const sendAdminEmailAlerts = async (order) => {
  const adminEmail = process.env.EMAIL_USER;

  await resend.emails.send({
    from: 'onboarding@resend.dev', // Leave this exactly as it is for the free tier
    to: adminEmail,
    subject: `🛒 New Order from ${order.buyerName}!`,
    html: `
      <h2>You have received a new storefront order!</h2>
      <p><strong>Customer Name:</strong> ${order.buyerName}</p>
      <p><strong>Item Ordered:</strong> ${order.itemName}</p>
      <p><strong>Quantity:</strong> ${order.quantity}</p>
      <p><strong>Total Earnings:</strong> ₦${order.totalPrice}</p>
      <p><strong>Delivery Location:</strong> ${order.deliveryAddress || 'Not provided'}</p>
      <p><strong>Contact Phone:</strong> ${order.phoneNumber}</p>
    `,
  });
};

// ==========================================
// 📱 TWILIO SMS NOTIFICATION SERVICE
// ==========================================
export const sendSMSNotifications = async (order) => {
  await twilioClient.messages.create({
    body: `THS Alert: New order from ${order.buyerName}! Item: ${order.itemName}, Total: ₦${order.totalPrice}. Phone: ${order.phoneNumber}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: process.env.ADMIN_PHONE_NUMBER // Your phone number where you receive text alerts
  });
};