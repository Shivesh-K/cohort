const jwt = require('jsonwebtoken');

module.exports.ensureAuthenticated = (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        if (!token)
            throw Error();
        jwt.verify(token, process.env.TOKEN_SECRET);
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ error: { auth: "User is not logged in" } });
    }
}

module.exports.ensureNotAuthenticated = (req, res, next) => {
    const token = req.cookies.jwt;
    try {
        if (!token)
            throw Error();
        jwt.verify(token, process.env.TOKEN_SECRET);
        return res
            .status(403)
            .json({ error: { auth: "User is already logged in" } });
    } catch (error) {
        next();
    }
}