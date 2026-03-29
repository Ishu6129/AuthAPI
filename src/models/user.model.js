import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:[true,"Username must be unique"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email must be unique"],
        lowercase:true,
        match:[/^\S+@\S+\.\S+$/,"Please fill a valid email address"],
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        select:false
    }
})
const User=mongoose.model("user",userSchema)
export default User;
