import User from "../models/user.js";
import express from "express";
import { isAuthenticated, logger } from "../app.js";

const userRouter = express.Router();

userRouter.get("/me", isAuthenticated, (req, res) => {
    res.json(req.user.serialize());
});

userRouter.get("/:id", isAuthenticated, async (req, res) => {
    const id = req.params.id;
    if (id !== req.user.id && !req.user.isTeacher()) {
        return res.status(403).json({ message: "Forbidden" });
    }
    try {
        const user = await User.findById(id);
        if (user) {
            return res.status(200).json(user.serializePublic());
        }
        return res.status(404).json({ message: "User not found" });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default userRouter;
