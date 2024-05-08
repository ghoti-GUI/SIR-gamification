import express from "express";
import { isAuthenticated, logger } from "../app.js";
import User from "../models/user.js";
import { getIndexGrades } from "../tp/indexGrades.js";

const adminRouter = express.Router();

adminRouter.get("/teachers", isAuthenticated, async (req, res) => {
    if (req.user.isAdmin()) {
        try {
            const teachers = await User.find({ $or: [{ type: "teacher" }, { type: "admin" }] });
            return res.status(200).json(
                teachers.map((teacher) => {
                    return teacher.serializeTeacherUser();
                }),
            );
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
});

adminRouter.delete("/teachers/:id", isAuthenticated, async (req, res) => {
    if (req.user.isAdmin()) {
        try {
            const teacher = await User.findById(req.params.id);
            if (teacher.type === "teacher") {
                teacher.type = "student";
                await teacher.save();
                return res.status(200).json({ message: "Teacher deleted successfully" });
            } else {
                return res.status(404).json({ message: "Teacher not found" });
            }
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
});

adminRouter.post("/setTps/:id", isAuthenticated, async (req, res) => {
    if (req.user.isAdmin()) {
        const tps = Array.from(getIndexGrades().keys());
        if (!req.body.tps || !Array.isArray(req.body.tps) || req.body.tps.some((tp) => !tps.includes(tp))) {
            return res.status(400).json({ message: "TPs not provided" });
        }
        try {
            const teacher = await User.findById(req.params.id);
            if (teacher.type === "teacher") {
                teacher.tps = req.body.tps;
                await teacher.save();
                return res.status(200).json({ message: "TPs set successfully" });
            } else {
                if (teacher.type === "admin" && teacher.id === req.user.id) {
                    teacher.tps = req.body.tps;
                    await teacher.save();
                    return res.status(200).json({ message: "TPs set successfully" });
                }
                return res.status(404).json({ message: "Teacher not found" });
            }
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
});

// Return all users that have the string in either their name or surname. The string can contain spaces and should be split into words
adminRouter.post("/users/", isAuthenticated, async (req, res) => {
    if (req.user.isAdmin()) {
        try {
            // Split the string into words
            const words = req.body.searchString.split(" ");

            // Create a regex pattern for each word
            const regexPatterns = words.map((word) => new RegExp(word, "i"));

            // Find users where either name or surname matches any of the regex patterns
            const users = await User.find({
                $or: [{ name: { $in: regexPatterns } }, { surname: { $in: regexPatterns } }],
                type: "student",
            });

            return res.status(200).json(users.map((user) => user.serializeTeacherUser()));
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
});

adminRouter.post("/addTeacher", isAuthenticated, async (req, res) => {
    if (req.user.isAdmin()) {
        try {
            const teacher = await User.findById(req.body.id);
            if (teacher) {
                if (teacher.type === "student") {
                    teacher.type = "teacher";
                    teacher.tps = req.body.tps;
                    await teacher.save();
                    return res.status(200).json({ message: "Teacher added successfully" });
                } else {
                    return res.status(409).json({ message: "User is already a teacher" });
                }
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            logger.error(error);
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
});

export default adminRouter;
