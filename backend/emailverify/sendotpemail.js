
import nodemailer from "nodemailer";

export const sendotpemail = async (otp, email) => {
    try {
        // Configure email transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your password reset OTP is ${otp}. It is valid for 10 minutes. Do not share this OTP with anyone.`
        });

        return true;

    } catch (error) {
        throw error;
    }
};
