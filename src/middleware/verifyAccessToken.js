import sessionModel from "../models/session.model.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export async function verifyAccessToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access token missing" });

    let decoded;
    try {
        decoded = jwt.verify(token, config.JWT_SECRET);
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

    const session = await sessionModel.findById(decoded.sessionId);
    if (!session || session.revoked)
        return res.status(401).json({ message: "Session expired or revoked" });

    if (session.ip !== req.ip || session.userAgent !== req.headers["user-agent"])
        return res.status(401).json({ message: "Session mismatch" });

    req.user = { id: decoded.id, sessionId: session._id };
    next();
}