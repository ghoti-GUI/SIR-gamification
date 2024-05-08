import { logger } from "../app.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Session from "../models/session.js";

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (token == null) return res.status(401).send("No token provided");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, payload) => {
        if (err) {
            logger.error(err);
            return res.status(403).send("Invalid token");
        }
        try {
            req.user = await User.findById(payload.userId);
            req.tpSession = await Session.findById(payload.sessionId);
            if (!req.user || !req.tpSession) return res.status(403).send("Invalid token");
            return next();
        } catch (err) {
            logger.error(err);
            return res.status(403).send("Invalid credentials");
        }
    });
}

export default authenticateToken;
