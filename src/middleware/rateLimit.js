import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { connection } from "../queues/emailQueue.js";

// helper for Redis (ioredis)
const redisStore = (prefix) =>
    new RedisStore({
        sendCommand: (...args) => connection.call(...args),
        prefix,
    });


// GLOBAL LIMITER (all APIs)
export const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,

    message: {
        success: false,
        message: "Too many requests. Please slow down."
    },

    standardHeaders: true,
    legacyHeaders: false,

    store: redisStore("rate-limit:global:"),

    keyGenerator: (req) => ipKeyGenerator(req),
});


//  AUTH LIMITER (shared across auth routes)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,

    message: {
        success: false,
        message: "Too many attempts. Try again after 15 minutes."
    },

    store: redisStore("rate-limit:auth:"),

    keyGenerator: (req) =>
        ipKeyGenerator(req) + ":" + (req.body.email || ""),
});


// LOGIN STRICT LIMITER
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,

    message: {
        success: false,
        message: "Too many login attempts. Try again later."
    },

    store: redisStore("rate-limit:login:"),

    keyGenerator: (req) =>
        ipKeyGenerator(req) + ":" + (req.body.email || "") + ":login",
});


// OTP LIMITER
export const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,

    message: {
        success: false,
        message: "Too many OTP requests. Please wait."
    },

    store: redisStore("rate-limit:otp:"),

    keyGenerator: (req) =>
        ipKeyGenerator(req) + ":" + (req.body.email || "") + ":" + req.originalUrl,
});