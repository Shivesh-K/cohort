const jwt = require('jsonwebtoken');

const User = require('../models/User');

const handleError = err => {
    let error = { username: '', password: '' };

    if (err.code === 11000)
        error.username = 'Username has been used';
    else if (err.message.toLowerCase().includes('username'))
        error.username = err.message;
    else if (err.message.toLowerCase().includes('password'))
        error.password = err.message;
    else if (err.message.toLowerCase().includes('name'))
        error.password = err.message;
    else if (err.message.includes('User validation failed'))
        Object.values(err.errors).forEach(({ properties }) => error[properties.path] = properties.message);
    else
        error = { auth: "There was some problem" };
    console.log(err);
    return error;
};

const createToken = (id) => {
    return jwt.sign(
        { id },
        process.env.TOKEN_SECRET,
        { expiresIn: 60 * 60 * 24 }
    );
};

module.exports.signup_post = async (req, res) => {
    try {
        const { username, password, name } = req.body;
        const user = await User.create({ username, password, name });
        const token = createToken(user._id);
        res.cookie(
            'jwt',
            token,
            { httpOnly: true, maxAge: 1000 * 60 * 60 * 24, secure: true }
        );
        await User.findByIdAndUpdate(user._id, { status: "ONLINE" });
        res.status(201).json({ user: { id: user._id, username: user.username, name: user.name } });

    } catch (error) {
        error = handleError(error);
        res.status(400).json({ error });
    }
};

module.exports.login_post = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.authenticateUser(username, password);
        const token = createToken(user._id);
        res.cookie(
            'jwt',
            token,
            { httpOnly: true, maxAge: 1000 * 60 * 60 * 24, secure: true }
        );
        await User.findByIdAndUpdate(user._id, { status: "ONLINE" });
        res.status(201).json({ user: { id: user._id, username: user.username, name: user.name } });

    } catch (error) {
        error = handleError(error);
        res.status(400).send({ error });
    }
};

module.exports.logout_delete = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token)
            throw Error("Username is not logged in");

        const { id } = jwt.decode(token);
        await User.findByIdAndUpdate(id, { status: "OFFLINE" });
        console.log("Logged Out")

        res.cookie('jwt', '', { maxAge: 1 });
        res.sendStatus(201);
    } catch (error) {
        error = handleError(error);
        res.status(400).send({ error });
    }
};

module.exports.verify_get = (req, res) => {
    res.sendStatus(201);
}