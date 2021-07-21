import { io } from 'socket.io-client';
import { get } from 'svelte/store';

import { currentUser } from '../stores';

class SignallingChannel {
    room;
    initiator;
    receiver;
    socket;
    onData;
    onHungUp;

    constructor({ initiator, receiver, callid }) {
        // Get the current user and create a socket
        this.user = get(currentUser);
        this.room = callid;
        this.initiator = initiator;
        this.receiver = receiver;
        this.socket = io({
            query: {
                userid: this.user.id,
                room: this.room
            }
        });

        // Set event listener for socket
        this.socket.on('data', (payload) => this.onData(payload));
        this.socket.on('hung-up', (_) => this.onHungUp());
    }

    // Function to send data to the signalling server
    send(data) {
        this.socket.emit('data', { data, room: this.room });
    }

    hangUp() {
        this.socket.emit(
            'hang-up',
            { callid: this.room, initiator: this.initiator, receiver: this.receiver }
        );
        this.dispose();
    }

    dispose() {
        this.socket.close();
    }
}

export default SignallingChannel;