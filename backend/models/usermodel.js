import mongoose from "mongoose"
const userschema=new mongoose.Schema(
    {
        username:{type: String,required:true},
        email:{type: String,required:true,unique: true},
        password:{type: String,required:true},
        isVerified:{type: Boolean, default:false},
        isloggedIn:{type: Boolean, default:false},
        token:{type:String,default:null},
        otp:{type: String, default:null},
        otpexpairy:{type: Date, default:null},
        isResetPasswordVerified: {
        type: Boolean,
        default: false
},
       
    },{timestamps:true}
)
export const User =mongoose.model("User",userschema)