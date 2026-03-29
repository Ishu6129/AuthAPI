import mongoose from "mongoose";

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"],
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/,"Please fill a valid email address"],
        trim:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    otpHash:{
        type:String,
        required:true
    },
    expiresAt: {
        type: Date,
        required: true,
        default: () => Date.now() + 10 * 60 * 1000,
        index: { expires: 0 }
    },
    attempts:{
        type:Number,
        default:0
    }
},{timestamps:true})

const Otp=mongoose.model("otp",otpSchema)
export default  Otp;

