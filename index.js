const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Importing routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const User = require('./models/User');
const Call = require('./models/Call');

// Setting middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./client/public'));
app.use(cookieParser());

// Configuring MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to DB"))
    .catch(err => console.log(err));


// Setting routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'public', 'index.html')));

const server = require('http').Server(app);
const io = require('socket.io')(server);

let activeSockets = [];

io.on('connection', socket => {

    const { userid, room } = socket.handshake.query;
    if (room)
        socket.join(room);
    activeSockets.push({ socket, userid });

    socket.on('call-made', async (payload) => {
        const { initiator, receiver } = payload;
        try {
            const peerUser = await User.findOne({ _id: receiver.id });

            if (peerUser.status === 'OFFLINE')
                throw Error(`@${peerUser.username} is not online`);
            if (peerUser.status === 'BUSY')
                throw Error(`@${peerUser.username} is on another call`);

            const call = new Call({ initiator: initiator.id, receiver: receiver.id })
            const callid = `${call._id}`;

            const receiverSocket = activeSockets.find(socket => socket.userid === receiver.id);
            const initiatorSocket = activeSockets.find(socket => socket.userid === initiator.id);

            if (!receiverSocket)
                throw Error(`@${peerUser.username} is not online`);

            initiatorSocket.socket.join(`${callid}`);
            receiverSocket.socket.join(`${callid}`);

            await User.findByIdAndUpdate(initiator.id, { $set: { status: "BUSY" } });

            socket.to(callid).emit('call-made', { callid, ...payload });

        } catch (error) {
            // callback({ error: error.message });
            socket.emit('call-error', error.message);
        }
    });

    socket.on('data', (payload) => {
        socket.to(payload.room).emit('data', payload);
    });

    socket.on('call-accepted', async (payload) => {
        await User.findByIdAndUpdate(payload.receiver.id, { $set: { status: "BUSY" } });
        await User.findByIdAndUpdate(payload.initiator.id, { $set: { status: "BUSY" } });
        socket.to(payload.callid).emit('call-accepted', payload);
    });

    socket.on('call-rejected', async (payload) => {
        await User.findByIdAndUpdate(payload.initiator.id, { $set: { status: "ONLINE" } });
        socket.to(payload.callid).emit('call-rejected', payload);
    });

    socket.on('call-missed', async (payload) => {
        await User.findByIdAndUpdate(payload.initiator.id, { $set: { status: "ONLINE" } });
        socket.to(payload.callid).emit('call-missed', payload);
    });

    socket.on('hang-up', async (payload) => {
        await User.findByIdAndUpdate(payload.initiator.id, { $set: { status: "ONLINE" } });
        await User.findByIdAndUpdate(payload.receiver.id, { $set: { status: "ONLINE" } });
        socket.to(payload.callid).emit('hung-up', payload);
    });

    socket.on('disconnect', () => {
        activeSockets = activeSockets.filter(actSocket => socket.id !== actSocket.socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));