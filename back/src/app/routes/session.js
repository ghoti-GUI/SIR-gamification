import express from "express";
import SessionModel from "../models/session.js";
import { isAuthenticated, logger } from "../app.js";
import { Progression } from "../models/progression.js";
import jwt from "jsonwebtoken";
import { getIndexGrades } from "../tp/indexGrades.js";

const sessionRouter = express.Router();
sessionRouter.get("/available", isAuthenticated, async (req, res) => {
    try {
        const sessions = await SessionModel.find({ startDate: { $lte: Date.now() }, endDate: { $gte: Date.now() } });
        return res.status(200).json(sessions.map((session) => session.serialize(req.user.id)));
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

sessionRouter.get("/all", isAuthenticated, async (req, res) => {
    if (req.user.isStudent()) {
        try {
            // Get active session or sessions that the student is enrolled in and that are done
            const sessions = await SessionModel.find({
                $or: [
                    {
                        startDate: { $lte: Date.now() },
                        endDate: { $gte: Date.now() },
                    },
                    { endDate: { $lte: Date.now() }, students: { $in: [req.user.id] } },
                ],
            });
            return res.status(200).json(sessions.map((session) => session.serializeStudent(req.user.id)));
        } catch (e) {
            logger.error(e);
            return res.status(500).json({ message: "Internal server error" });
        }
    } else if (req.user.isAdmin()) {
        try {
            const sessions = await SessionModel.find({});
            return res.status(200).json(sessions.map((session) => session.serializeTeacher()));
        } catch (e) {
            logger.error(e);
            return res.status(500).json({ message: "Internal server error" });
        }
    } else if (req.user.isTeacher()) {
        try {
            const sessions = await SessionModel.find({ teachers: { $in: [req.user.id] } });
            return res.status(200).json(sessions.map((session) => session.serializeTeacher()));
        } catch (e) {
            logger.error(e);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
});

sessionRouter.post("/new", isAuthenticated, async (req, res) => {
    if (!req.user.isTeacher()) {
        return res.status(403).json({ message: "Forbidden" });
    }
    let { name, password, startDate, endDate, TP, indexGrade } = req.body;
    // check if TP is either kafka or scrapping
    if (!TP || (TP !== "kafka" && TP !== "scrapping")) {
        return res.status(400).json({ message: "Invalid TP" });
    }
    if (!indexGrade) {
        indexGrade = new Map(getIndexGrades().get(TP)());
    }
    let newSession = new SessionModel({
        name,
        password,
        startDate,
        endDate,
        teachers: [req.user.id],
        TP: TP,
        indexGrades: indexGrade,
    });
    try {
        const savedSession = await newSession.save();
        return res.status(200).json(savedSession.serializeTeacher());
    } catch (e) {
        if (e.name === "ValidatorError") {
            return res.status(400).json({ message: e.message });
        }
        logger.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

sessionRouter.get("/fetchTPs", isAuthenticated, async (req, res) => {
    if (!req.user.isTeacher()) {
        return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(200).json(Array.from(getIndexGrades().keys()));
});

sessionRouter.get("/:id", isAuthenticated, async (req, res) => {
    try {
        const session = await SessionModel.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        if (req.user.isStudent()) {
            return res.status(200).json(session.serializeStudent(req.user.id));
        } else if (req.user.isTeacher()) {
            return res.status(200).json(session.serializeTeacher());
        } else if (req.user.isAdmin()) {
            return res.status(200).json(session.serializeTeacher());
        }
        return res.status(403).json({ message: "Forbidden" });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

sessionRouter.delete("/:id", isAuthenticated, async (req, res) => {
    if (!req.user.isTeacher()) {
        return res.status(403).json({ message: "Forbidden" });
    }
    try {
        const session = await SessionModel.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        if (!session.teachers.includes(req.user.id)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (session.startDate < Date.now()) {
            return res.status(400).json({ message: "Session already started" });
        }
        await SessionModel.deleteOne({ _id: req.params.id });
        return res.status(200).json({ message: "Session deleted" });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

sessionRouter.post("/:id/end", isAuthenticated, async (req, res) => {
    if (!req.user.isTeacher()) {
        return res.status(403).json({ message: "Forbidden" });
    }
    try {
        const session = await SessionModel.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        if (!session.teachers.includes(req.user.id)) {
            return res.status(403).json({ message: "Vous n'avez pas les droits pour terminer la session" });
        }
        if (session.endDate < Date.now()) {
            return res.status(400).json({ message: "Session already ended" });
        }
        session.endDate = Date.now();
        await session.save();
        return res.status(200).json(session.serializeTeacher());
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

sessionRouter.post("/:id/join", isAuthenticated, async (req, res) => {
    if (!req.user.isStudent()) {
        return res.status(403).json({ message: "Forbidden" });
    }
    try {
        const session = await SessionModel.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        if (session.startDate > Date.now()) {
            return res.status(400).json({ message: "Session not started" });
        }
        if (session.endDate < Date.now()) {
            return res.status(400).json({ message: "Session already ended" });
        }
        if (session.students.includes(req.user.id)) {
            const progression = await Progression.findOne({ userId: req.user.id, sessionId: session.id });
            const token = jwt.sign(
                { userId: req.user.id, sessionId: session.id, exp: session.endDate.getTime() / 1000 },
                process.env.ACCESS_TOKEN_SECRET,
            );
            return res.status(200).json({
                session: session.serializeStudent(req.user.id),
                token: token,
                progression: progression.serialize(),
            });
        }
        if (!req.body.password) {
            return res.status(400).json({ message: "Missing password" });
        }
        if (session.validatePassword(req.body.password)) {
            session.students.push(req.user.id);
            await session.save();
            const progression = new Progression({
                userId: req.user.id,
                sessionId: session.id,
                progression: 0,
            });
            try {
                await progression.save();
            } catch (e) {
                logger.error(e);
                if (e.name === "ValidationError") {
                    return res.status(400).json({ message: e.message });
                }
                return res.status(500).json({ message: "Internal server error" });
            }
            await progression.save();
            const token = jwt.sign(
                { userId: req.user.id, sessionId: session.id, exp: session.endDate.getTime() / 1000 },
                process.env.ACCESS_TOKEN_SECRET,
            );
            return res.status(200).json({
                session: session.serializeStudent(req.user.id),
                token: token,
                progression: progression.serialize(),
            });
        }
        return res.status(403).json({ message: "Invalid password" });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

sessionRouter.post("/:id/edit", isAuthenticated, async (req, res) => {
    if (!req.user.isTeacher()) {
        return res.status(403).json({ message: "Forbidden" });
    }
    try {
        const session = await SessionModel.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        if (!session.teachers.includes(req.user.id) && !req.user.isAdmin()) {
            return res.status(403).json({ message: "Forbidden" });
        }
        if (session.startDate > Date.now()) {
            if (req.body.startDate) {
                session.startDate = req.body.startDate;
            }
            if (req.body.TP) {
                session.TP = req.body.TP;
            }
            if (req.body.name) {
                session.name = req.body.name;
            }
        }
        if (session.endDate > Date.now()) {
            if (req.body.endDate) {
                session.endDate = req.body.endDate;
            }
        }
        if (req.body.password) {
            session.password = req.body.password;
        }
        await session.save();
        return res.status(200).json(session.serializeTeacher());
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default sessionRouter;
