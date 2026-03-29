import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import sessionModel from '../models/session.model.js';

export async function register(req, res) {
    console.log(req.headers);
    const {username,email,password}=req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields required"
        });
    }
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

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser=new User({
        username,email,password:hashPassword
    })
    await newUser.save();

    
    const refreshToken=jwt.sign({id:newUser._id},config.JWT_SECRET,{expiresIn:"7d"})
    
    const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session=new sessionModel({
        user:newUser._id,
        refreshToken:refreshTokenHash,
        ip:req.ip,
        userAgent:req.headers['user-agent']
    })
    await session.save();
    
    const accessToken=jwt.sign({id:newUser._id,sessionId:session._id},config.JWT_SECRET,{expiresIn:"15m"})
    
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })
    res.status(201).json({
        success:true,
        message:"User registered successfully",
        accessToken
    })
}

export async function login(req,res){
    const {email,password}=req.body;
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return res.status(401).json({
            success:false,
            message:"Invalid email or password"
        })
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(401).json({
            success:false,
            message:"Invalid email or password"
        })
    }
    const refreshToken=jwt.sign({id:user._id},config.JWT_SECRET,{expiresIn:"7d"})
    const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");
   
    const session=new sessionModel({
        user:user._id,
        refreshToken:refreshTokenHash,
        ip:req.ip,
        userAgent:req.headers['user-agent']
    })
    await session.save();
    const accessToken=jwt.sign({id:user._id,sessionId:session._id},config.JWT_SECRET,{expiresIn:"15m"})
    
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })
    res.status(200).json({
        success:true,
        message:"Logged in successfully",
        accessToken
    })
}

export async function getMe(req, res) {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
    res.status(200).json({
        message: "User fetched successfully",
        user
    });
}

export async function refreshToken(req,res){
    const refreshToken=req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            success:false,
            message:"Refresh Token Not Found"
        })
    }
    let decoded;
    try {
        decoded = jwt.verify(refreshToken, config.JWT_SECRET);
    }
    catch (err) {
        return res.status(401).json({
            success:false,
            message:"Invalid or expired refresh token"
        });
    }

    const refreshTokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session=await sessionModel.findOne({refreshToken:refreshTokenHash,revoked:false});
    if(!session){
        return res.status(401).json({
            success:false,
            message:"Invalid Refresh Token or session Revoked"
        })
    }
    const newAccessToken=jwt.sign({id:decoded.id,sessionId: session._id },config.JWT_SECRET,{expiresIn:"15m"})
    
    const newRefreshToken=jwt.sign({id:decoded.id},config.JWT_SECRET,{expiresIn:"7d"})
    const newRefreshTokenHash=crypto.createHash("sha256").update(newRefreshToken).digest("hex");
    session.refreshToken=newRefreshTokenHash;
    await session.save();
    res.cookie("refreshToken",newRefreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:7*24*60*60*1000
    })

    res.status(200).json({
        success:true,
        newAccessToken
    })
}

export async function logout(req,res){
    const session = await sessionModel.findById(req.user.sessionId);
    if(session){
        session.revoked = true;
        await session.save();
    }

    res.clearCookie("refreshToken");
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    });
}

export async function logoutAll(req,res){
    await sessionModel.updateMany({user: req.user.id, revoked:false}, {revoked:true});

    res.clearCookie("refreshToken");
    res.status(200).json({
        success:true,
        message:"Logged out from all sessions successfully"
    });
}