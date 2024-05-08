export const checkSessionValidity = (tp) => {
    return function (req, res, next) {
        if (req.tpSession.students.indexOf(req.user._id) === -1)
            return res.status(403).send("You are not a student of this session");
        if (req.tpSession.startDate > Date.now() || req.tpSession.endDate < Date.now())
            return res.status(403).send("This session is not active");
        if (tp && req.tpSession.TP !== tp) {
            return res.status(403).send("This session is not for this TP");
        }
        return next();
    };
};
