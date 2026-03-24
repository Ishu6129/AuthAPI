import User from '../models/user.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export async function register(req, res) {
    const {username,email,password}=req.body;

    const isAlreadyExist=await User.findOne({
        $or:[
            {username},{email}
        ]})
    if(isAlreadyExist){
        return res.status(409).json({
            success:false,
            message:"Username or email already exist"
        })
    }
    const hashPassword=crypto.createHash("sha256").update(password).digest("hex");
    const newUser=new User({
        username,email,password:hashPassword
    })
    await newUser.save();
    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token",token)
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        token:token
    })
}
