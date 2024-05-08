import { Progression } from "../models/progression.js";

export const checkProgressionValidity = (level) => {
    return async (req, res, next) => {
        try {
            const progression = await Progression.findOne({ userId: req.user._id, sessionId: req.tpSession._id });
            if (progression) {
                if (progression.level === level) {
                    req.progression = progression;
                    return next();
                } else {
                    return res.status(403).send("You are not at this level");
                }
            } else {
                return res.status(500).send("Progression does not exist when it should");
            }
        } catch (e) {
            return res.status(500).send("Something went wrong");
        }
    };
};
