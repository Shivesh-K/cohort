import { io } from "socket.io-client";
import { navigate } from 'svelte-routing';
import { get } from 'svelte/store';

import { currentUser, offers } from '../stores';
import { getUserByUsername } from '../helpers/user'

class Caller {
    socket;
    user;
    timeouts;
    onCalled;
    onAccepted;
    onRejected;
    onError;

    constructor() {
        // Setting up user and connecting socket
        this.user = get(currentUser);
        this.socket = io({ query: { userid: this.user.id } });
        this.timeouts = [];

        // Binding socket events to methods
        this.socket.on("call-made", (payload) => this.onCalled(payload));
        this.socket.on("call-accepted", (payload) => this.onAccepted(payload));
        this.socket.on('call-rejected', (payload => this.onRejected(payload)));
        this.socket.on('call-missed', (payload => this.onMissed(payload)));
        this.socket.on("call-error", (err) => this.onError(err));

    }

    async call(username) {
        console.log("Caller call");

        const peer = await getUserByUsername(username); // Get the user ID corresponding to the entered username
        if (peer.id === this.user.id) throw Error("You cannot call yourself");

        this.socket.emit(
            'call-made',
            {
                initiator: this.user,
                receiver: peer,
            }
        );
        console.log("Caller called");
    }

    acceptCall(offer) {
        const { callid, initiator, receiver, timeout } = offer;
        clearTimeout(timeout);
        this.socket.emit('call-accepted', offer);
        navigate(`/call/${callid}`, { state: { callid, initiator, receiver } });
    }

    rejectCall(offer) {
        const { callid, timeout } = offer;
        clearTimeout(timeout);
        offers.update((currOffers) => currOffers.filter(offer => offer.callid !== callid));
        this.socket.emit("call-rejected", offer);
    }

    missCall(offer) {
        const { callid } = offer;
        offers.update((currOffers) => currOffers.filter(offer => offer.callid !== callid));
        this.socket.emit("call-missed", offer);
    }

    rejectAll() {
        let remainingOffers = get(offers);
        for (let offer of remainingOffers) {
            this.rejectCall(offer);
        }
    }

    dispose() {
        this.rejectAll();
        this.socket.close();
    }
}

export default Caller;