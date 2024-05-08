import express from "express";
import userRouter from "./user.js";
import sessionRouter from "./session.js";
import scrappingRouter from "./scrapping.js";
import passport from "passport";
import User from "../models/user.js";
import { logger } from "../app.js";
import gradeRouter from "./grade.js";
import adminRouter from "./admin.js";

const mainRouter = express.Router();

mainRouter.get("/", (req, res) => {
    res.json({
        api: "v1",
        version: "0.0.0",
    });
});

mainRouter.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, params) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: params.message });
        // user is authenticated, create a session
        req.logIn(user, (err) => {
            if (err) return next(err);
            // send the user object
            return res.json(user.serialize());
        });
    })(req, res, next);
});

mainRouter.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ status: "OK" });
    });
});

mainRouter.post("/register", async (req, res) => {
    const { username, password, name, surname, email } = req.body;
    if (!username || !password || !name || !surname || !email) {
        return res.status(400).json({ error: "Missing fields" });
    }
    try {
        const user = await User.findOne({ username });
        if (user) return res.status(400).json({ error: "User already exists" });
        const newUser = new User({
            username,
            password,
            name,
            surname,
            email,
            type: "student",
        });
        await newUser.save();
        req.logIn(newUser, (err) => {
            if (err) {
                logger.error(err);
                return res.status(500).json({ error: "Internal server error" });
            }
            return res.json(newUser.serialize());
        });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

mainRouter.use("/user", userRouter);
mainRouter.use("/session", sessionRouter);
mainRouter.use("/grade", gradeRouter);
mainRouter.use("/scrapping", scrappingRouter);
mainRouter.use("/admin", adminRouter);

export default mainRouter;
