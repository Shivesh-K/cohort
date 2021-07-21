const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Email must be provided"],
        unique: [true, "Username is already in use"],
        minlength: [1, "The username must be at least 1 character long"]
    },
    name: {
        type: String,
        required: [true, "A name must be provided"],
        minlength: [1, "Name cannot be empty"],
        default: 'Shivesh'
    },
    password: {
        type: String,
        required: [true, "Password must be provided"],
        minlength: [8, "Password must be at least 8 characters long"]
    },
    status: {
        type: String,
        enum: ['ONLINE', 'OFFLINE', 'BUSY'],
        default: 'OFFLINE',
    }
}, { strict: false });

UserSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.statics.authenticateUser = async function (username, password) {
    const user = await this.findOne({ username });
    if (user) {
        console.log(user.password);
        const matched = await bcrypt.compare(password, user.password);
        if (matched)
            return user;
        throw Error("Incorrect password");
    }
    throw Error("Username does not exist");
}

module.exports = mongoose.model('User', UserSchema);