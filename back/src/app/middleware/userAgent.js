export function userAgentMiddleware(req, res, next) {
    // if user agent is not scrapper then error
    // if (process.env.ENV === "dev") {
    //     return next();
    // }
    if (!req.headers["user-agent"] || req.headers["user-agent"].indexOf("scrapper") === -1) {
        return res.status(403).send("Interdit - Vous devez utiliser le scrapper");
    }
    next();
}
