import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export const sendOtp = async (userEmail: string) => {
  try {
    // Step 1: Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Step 2: Create a Nodemailer transporter using Google's SMTP server
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail App Password
      },
    });

    // Step 3: Prepare the email content
    const mailOptions = {
      from: `"ExamSphere" <${process.env.GMAIL_USER}>`, // Your Gmail address
      to: userEmail,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="color: #007bff; text-align: center;">Your OTP Code</h2>
          <p>Dear User,</p>
          <p>Use the following One-Time Password (OTP) to complete your request. The OTP is valid for 10 minutes:</p>
          <div style="font-size: 20px; font-weight: bold; text-align: center; color: #333; padding: 10px; border: 1px dashed #007bff; border-radius: 5px; width: fit-content; margin: auto;">
            ${otp}
          </div>
          <p>If you did not request this, please ignore this email.</p>
          <p>Best Regards,<br>YourAppName Team</p>
        </div>
      `,
    };

    // Step 4: Send the email
    await transporter.sendMail(mailOptions);

    // Return the OTP
    return otp;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email.");
  }
};
