import nodemailer from "nodemailer";
import 'dotenv/config'

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const verifymail = async (token,email) => {

    const mailOptions = {
        from: process.env.EMAIL_USER, 
        to: email,  
        subject: "Verify Your Email",
         html: `
        <div style="
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 30px auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 12px;
            text-align: center;
        ">

            <h1 style="color: #333;">
                Welcome! 👋
            </h1>

            <p style="font-size: 16px; color: #555;">
                Thanks for creating an account with us.
            </p>

            <p style="font-size: 16px; color: #555;">
                Please verify your email address by clicking the button below.
            </p>

            <a 
                href="http://localhost:8000/user/verify/${token}"
                style="
                    display: inline-block;
                    margin: 20px 0;
                    padding: 14px 30px;
                    background-color: #2563eb;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                "
            >
                Verify My Email
            </a>

            <p style="font-size: 13px; color: #888;">
                This verification link will expire in 10 minutes.
            </p>

            <hr style="border: none; border-top: 1px solid #eee;">

            <p style="font-size: 12px; color: #999;">
                If you didn't create this account, you can safely ignore this email.
            </p>

        </div>
        `
    };

    await transporter.sendMail(mailOptions,function(error,info)
    {
        try {
            console.log('email sent successful');
            console.log(info);
            
        } catch (error) {
          throw  new Error(error)
            
        }
    });
};