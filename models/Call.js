const mongoose = require('mongoose');

const CallSchema = mongoose.Schema({
    initiator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "There must be an initiator"],
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "There must be an receiver"],
    },
    status: {
        type: String,
        enum: ['CONNECTING', 'ACTIVE', 'REJECTED', 'ENDED', 'MISSED'],
        default: 'CONNECTING',
    }
}, { strict: false });

module.exports = mongoose.model('Call', CallSchema);