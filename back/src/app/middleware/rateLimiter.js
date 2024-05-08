import rateLimit from "express-rate-limit";

export const limiterLvl3 = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 40,
    standardHeaders: "draft-07",
    legacyHeaders: false,
});

export const limiterLvl4 = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50,
    standardHeaders: "draft-07",
    legacyHeaders: false,
});
