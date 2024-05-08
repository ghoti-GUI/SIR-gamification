import express from "express";
import { isAuthenticated, logger } from "../app.js";
import { Progression } from "../models/progression.js";
import Session from "../models/session.js";
import { getIndexGrades } from "../tp/indexGrades.js";

const gradeRouter = express.Router();

gradeRouter.get("/my", isAuthenticated, async (req, res) => {
    if (req.user.isStudent()) {
        try {
            const progressions = await Progression.find({ userId: req.user.id }).populate("sessionId");
            return res.status(200).json(
                progressions.map((progression) => {
                    return {
                        sessionName: progression.sessionId.name,
                        tp: progression.sessionId.TP,
                        grade: progression.grade,
                        bonus: progression.helped.length > 0 ? Math.floor(Math.log2(progression.helped.length)) : 0,
                        level: progression.level,
                        mean: progression.sessionId.meanGrades,
                        std: progression.sessionId.standDevGrades,
                        coefficient: 1,
                        sessionId: progression.sessionId._id,
                        progressionId: progression._id,
                    };
                }),
            );
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        return res.status(403).json({ message: "You should not be here" });
    }
});

gradeRouter.get("/all/:sessionId", isAuthenticated, async (req, res) => {
    if (req.user.isTeacher()) {
        try {
            const progressions = await Progression.find({ sessionId: req.params.sessionId }).populate("userId");
            if (!progressions) {
                return res.status(404).json({ message: "Progressions not found" });
            }
            return res.status(200).json(
                progressions.map((progression) => {
                    return {
                        progressionId: progression._id,
                        studentName: progression.userId.name + " " + progression.userId.surname,
                        grade: progression.grade,
                        bonus: progression.helped.length > 0 ? Math.floor(Math.log2(progression.helped.length)) : 0,
                        level: progression.level,
                        gradeOverriden: progression.teacherGradeOverride,
                        gradeComment: progression.teacherGradeComment,
                    };
                }),
            );
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
});

gradeRouter.post("/resetGrade/:progressionId", isAuthenticated, async (req, res) => {
    if (req.user.isTeacher()) {
        try {
            const progression = await Progression.findById(req.params.progressionId).populate("sessionId");
            if (!progression) {
                return res.status(404).json({ message: "Progression not found" });
            }
            progression.grade = progression.sessionId.indexGrades.get(progression.level.toString());
            progression.teacherGradeOverride = false;
            progression.teacherGradeComment = "";
            await progression.save();
            return res.status(200).json({ message: "Grade reset" });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
});

gradeRouter.post("/setGrade/:progressionId", isAuthenticated, async (req, res) => {
    if (req.user.isTeacher()) {
        if (req.body.grade === undefined || req.body.grade === null) {
            return res.status(400).json({ message: "Grade is missing" });
        }
        if (req.body.grade < 0 || req.body.grade > 20) {
            return res.status(400).json({ message: "Grade must be between 0 and 20" });
        }
        try {
            const progression = await Progression.findById(req.params.progressionId);
            if (!progression) {
                return res.status(404).json({ message: "Progression not found" });
            }
            progression.grade = req.body.grade;
            progression.teacherGradeOverride = true;
            progression.teacherGradeComment = req.body.comment;
            await progression.save();
            return res.status(200).json({ message: "Grade overriden" });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
});

gradeRouter.post("/setLevelGrade/:sessionId", isAuthenticated, async (req, res) => {
    if (req.user.isTeacher()) {
        try {
            if (req.body.level === undefined || req.body.level === null) {
                return res.status(400).json({ message: "Level is missing" });
            }
            if (req.body.grade === undefined || req.body.grade === null) {
                return res.status(400).json({ message: "Grade is missing" });
            }
            if (req.body.grade < 0 || req.body.grade > 20) {
                return res.status(400).json({ message: "Grade must be between 0 and 20" });
            }
            const session = await Session.findById(req.params.sessionId);
            if (!session) {
                return res.status(404).json({ message: "Session not found" });
            }
            if (!session.teachers.some((teacher) => teacher.id === req.user.id) && !req.user.isAdmin()) {
                return res.status(403).json({ message: "You are not allowed to access this resource" });
            }
            const progressions = await Progression.find({ sessionId: req.params.sessionId }).populate("userId");
            const filtered = progressions.filter((progression) => progression.level === req.body.level);
            filtered.forEach((progression) => {
                if (progression.teacherGradeOverride === false) {
                    progression.grade = req.body.grade;
                    progression.save();
                }
            });
            session.indexGrades.set(req.body.level.toString(), req.body.grade);
            await session.save();
            // Non modified progressions
            const nonModified = filtered.filter((progression) => progression.teacherGradeOverride === true);
            return res.status(200).json(
                nonModified.map((progression) => {
                    return {
                        progressionId: progression._id,
                        studentName: progression.userId.name + " " + progression.userId.surname,
                        grade: progression.grade,
                        level: progression.level,
                        gradeOverriden: progression.teacherGradeOverride,
                        gradeComment: progression.teacherGradeComment,
                    };
                }),
            );
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
});

gradeRouter.post("/removeLevelGrade/:sessionId", isAuthenticated, async (req, res) => {
    if (req.user.isTeacher()) {
        try {
            const session = await Session.findById(req.params.sessionId);
            if (!session) {
                return res.status(404).json({ message: "Session not found" });
            }
            if (!session.teachers.some((teacher) => teacher.id === req.user.id) && !req.user.isAdmin()) {
                return res.status(403).json({ message: "You are not allowed to access this resource" });
            }
            const progressions = await Progression.find({ sessionId: req.params.sessionId }).populate("userId");
            progressions.forEach((progression) => {
                if (progression.teacherGradeOverride === false) {
                    progression.grade = progression.sessionId.indexGrades.get(progression.level.toString());
                    progression.save();
                }
            });
            session.indexGrades = new Map(getIndexGrades().get(session.TP)());
            await session.save();
            // Non modified progressions
            const nonModified = progressions.filter((progression) => progression.teacherGradeOverride === true);
            return res.status(200).json(
                nonModified.map((progression) => {
                    return {
                        progressionId: progression._id,
                        studentName: progression.userId.name + " " + progression.userId.surname,
                        grade: progression.grade,
                        level: progression.level,
                        gradeOverriden: progression.teacherGradeOverride,
                        gradeComment: progression.teacherGradeComment,
                    };
                }),
            );
        } catch (err) {
            logger.error(err);
            return res.status(500).json({ message: err.message });
        }
    } else {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
});

gradeRouter.post("/editStudentLevel/:progressionId", isAuthenticated, async (req, res) => {
    if (req.user.isTeacher()) {
        try {
            const progression = await Progression.findById(req.params.progressionId);
            if (!progression) {
                return res.status(404).json({ message: "Progression not found" });
            }
            if (!req.body.level) {
                return res.status(400).json({ message: "Level is missing" });
            }
            progression.level = req.body.level;
            await progression.save();
            return res.status(200).json({ message: "Level edited" });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        return res.status(403).json({ message: "You are not allowed to access this resource" });
    }
});

gradeRouter.post("/students/:sessionid", isAuthenticated, async (req, res) => {
    if (req.user.isStudent()) {
        try {
            const session = await Session.findById(req.params.sessionid).populate("students");
            if (!session) {
                return res.status(404).json({ message: "Session not found" });
            }
            if (!session.students.some((student) => student.id === req.user.id)) {
                return res.status(403).json({ message: "You are not in this session" });
            }
            // Filter the students based on the searchString
            const words = req.body.searchString.split(" ");
            // Create a regex pattern for each word
            const regexPatterns = words.map((word) => new RegExp(word, "i"));

            // Find users where either name or surname matches any of the regex patterns
            const users = session.students.filter((user) => {
                return (
                    regexPatterns.some((pattern) => {
                        return pattern.test(user.name) || pattern.test(user.surname);
                    }) && user.id !== req.user.id
                );
            });
            return res.status(200).json(
                users.map((user) => {
                    return user.serializePublic();
                }),
            );
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    } else {
        return res.status(403).json({ message: "You should not be here" });
    }
});

gradeRouter.get("/getBonus/:progressionId", isAuthenticated, async (req, res) => {
    try {
        const progression = await Progression.findById(req.params.progressionId).populate("helpedBy");
        if (!progression) {
            return res.status(404).json({ message: "Progression not found" });
        }
        if (progression.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not allowed to access this resource" });
        }
        return res.status(200).json(progression.helpedBy.map((user) => user.serializePublic()));
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

gradeRouter.post("/setBonus/:progressionId", isAuthenticated, async (req, res) => {
    const users = req.body.usersWithBonus;
    try {
        if (users.length > 2) {
            return res.status(400).json({ message: "You can't set more than 2 bonuses" });
        }
        if (users.length === 2 && users[0].id === users[1].id) {
            return res.status(400).json({ message: "You can't set the same user twice" });
        }
        if (users.some((user) => user.id === req.user.id)) {
            return res.status(400).json({ message: "You can't set yourself as a bonus" });
        }
        const progression = await Progression.findById(req.params.progressionId).populate("sessionId");
        if (!progression) {
            return res.status(404).json({ message: "Progression not found" });
        }
        if (progression.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not allowed to access this resource" });
        }
        if (progression.sessionId.endDate < new Date().setTime(new Date().getTime() - 60 * 60 * 1000)) {
            return res.status(400).json({ message: "cannot edit bonuses 1h after session ends" });
        }
        await progression.setHelpedBy(users);
        return res.status(200).json({ message: "Bonus set" });
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ message: err.message });
    }
});

export default gradeRouter;
