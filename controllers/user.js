const User = require('../models/User');

// const handleError = err => {
//     return err;
// };


module.exports.username_get = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username });
        if (!user)
            throw Error(`User ${username} does not exist`);
        res.status(200).send({
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
            }
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}

module.exports.userid_get = async (req, res) => {
    const { userid } = req.params;
    try {
        const user = await User.findOne({ id: userid });
        if (!user)
            throw Error(`User with id ${userid} does not exist`);
        res.status(200).send({
            user: {
                id: user._id,
                username: user.username,
                name: user.name,
            }
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}