import { verifymail } from "../emailverify/verifymail.js"
import { Session } from "../models/sessionmodel.js"
import { User } from "../models/usermodel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from "crypto";
import { sendotpemail } from "../emailverify/sendotpemail.js"
import registerSchema from "../validate/validateregister.js"


const registerUser = async (req, resp) => {
    try {
        // 1. Validate data using Yup
        const data = await registerSchema.validate(
            req.body,
            { abortEarly: false }
        );

        const { username, email, password } = data;

        // 2. Check whether user already exists
        const existinguser = await User.findOne({ email });

        if (existinguser) {
            return resp.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // 3. Hash password
        const hashpassword = await bcrypt.hash(password, 10);

        // 4. Create user
        const newUser = await User.create({
            username,
            email,
            password: hashpassword
        });

        // 5. Generate verification token
        const token = jwt.sign(
            { id: newUser._id },
            process.env.SECRATE_KEY,
            { expiresIn: "15m" }
        );

        // 6. Send verification email
        await verifymail(token, email);

        newUser.token = token;
        await newUser.save();

        return resp.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {

        // Handle Yup validation errors
        if (error.name === "ValidationError") {
            return resp.status(400).json({
                success: false,
                message: error.errors
            });
        }


        // Handle other errors
        return resp.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export default registerUser;



export const verification = async (req, res) => {
  try {
    const token = req.params.token;

    if (!token) {
      return res.status(400).send("Verification token is missing");
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.SECRATE_KEY);
    } catch (err) {
      return res.status(400).send(
        err.name === "TokenExpiredError"
          ? "Verification link has expired"
          : "Invalid verification token"
      );
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.isVerified) {
      return res.send("Email is already verified. You can log in.");
    }

    if (user.token !== token) {
      return res.status(400).send("Invalid or already used verification link");
    }

    user.isVerified = true;
    user.token = null;

    await user.save();

    return res.send("Email verified successfully! You can now log in.");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
};



export const loginUser = async (req, res) => {
    try {
        // 1. Get email and password
        const { email, password } = req.body;

        // 2. Both fields are compulsory
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // 3. Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // 4. Check password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Wrong password"
            });
        }

        // 5. Check email verification
        if (!user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email first"
            });
        }

        // 6. Remove old session
        await Session.deleteMany({
            userId: user._id
        });

        // 7. Generate Access Token
        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        // 8. Generate Refresh Token
        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }
        );

        // 9. Save Refresh Token in Session
        await Session.create({
            userId: user._id,
            refreshToken: refreshToken
        });

        // 10. Update login status
        user.isloggedIn = true;
        await user.save();

        // 11. Send response
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.username}`,
            accessToken: accessToken,
            refreshToken: refreshToken
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const logoutUser = async (req, res) => {
    try {
        // Get refresh token
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required"
            });
        }

        // Delete session
        const session = await Session.findOneAndDelete({
            refreshToken: refreshToken
        });


        if (!session) {
            return res.status(400).json({
                success: false,
                message: "Invalid refresh token"
            });
        }
         
    
        
        // Find user and update login status
        const user = await User.findById(session.userId);

        if (user) {
            user.isloggedIn = false;
            await user.save();
        }

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 1000000).toString();

        // Save OTP and expiry (5 minutes)
        user.otp = otp;
        user.otpexpairy = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        // Send OTP to email
        await sendotpemail(otp, email);

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Check required fields
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check OTP
        if (!user.otp || user.otp.toString() !== otp.toString()) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Check OTP expiry
        if (user.otpexpairy < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired"
            });
        }

        // Clear OTP after successful verification
        user.otp = null;
        user.otpexpairy = null;
       user.isResetPasswordVerified = true;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};




export const changePassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isResetPasswordVerified !== true) {
            return res.status(400).json({
                success: false,
                message: "Please verify OTP first"
            });
        }

        // Hash the new password
        user.password = await bcrypt.hash(newPassword, 10);

        // Reset verification status
        user.isResetPasswordVerified = false;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


