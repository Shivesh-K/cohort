<script>
    import { onDestroy, onMount } from "svelte";
    import { navigate } from "svelte-routing";
    const { RTCPeerConnection } = window;

    import SignallingChannel from "../classes/SignallingChannel";
    import { currentUser } from "../stores";
    import Navbar from "../components/Navbar.svelte";

    export let callid;
    export let initiator;
    export let receiver;

    let makingOffer = false;
    let ignoreOffer = true;
    let polite = initiator.id === $currentUser.id;

    let localVideo, remoteVideo;
    let pc = new RTCPeerConnection();
    let signaler = new SignallingChannel({ callid, initiator, receiver });

    signaler.onData = async ({ data: { description, candidate } }) => {
        try {
            if (description) {
                const offerCollision =
                    description.type == "offer" &&
                    (makingOffer || pc.signalingState != "stable");

                ignoreOffer = !polite && offerCollision;
                if (ignoreOffer) {
                    return;
                }

                await pc.setRemoteDescription(description);
                if (description.type == "offer") {
                    await pc.setLocalDescription();
                    signaler.send({ description: pc.localDescription });
                }
            } else if (candidate) {
                try {
                    await pc.addIceCandidate(candidate);
                } catch (err) {
                    if (!ignoreOffer) {
                        throw err;
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    signaler.onHungUp = () => {
        pc.close();
        if (localVideo) localVideo.srcObject = null;
        navigate("/", { replace: true });
    };

    pc.onnegotiationneeded = async () => {
        try {
            makingOffer = true;
            await pc.setLocalDescription();
            signaler.send({ description: pc.localDescription });
        } catch (err) {
            console.error(err);
        } finally {
            makingOffer = false;
        }
    };

    pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === "failed") {
            pc.restartIce();
        }
    };

    pc.onicecandidate = ({ candidate }) => {
        signaler.send({ candidate });
    };

    pc.ontrack = ({ track, streams }) => {
        track.onunmute = () => {
            if (remoteVideo.srcObject) {
                return;
            }
            remoteVideo.srcObject = streams[0];
        };
    };

    // To request for the local video capture and assign it to local-video
    const startLocalVideo = async () => {
        if (navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                localVideo.srcObject = stream;
                stream.getTracks().forEach((track) => {
                    pc.addTrack(track, stream);
                    // console.log(track);
                });
            } catch (error) {
                localVideo.srcObject = new MediaStream();
                console.error(error);
            }
        }
    };

    const hangUp = () => {
        signaler.hangUp();
        pc.close();
        if (localVideo) localVideo.srcObject = null;
        navigate("/", { replace: true });
    };

    onMount(() => {
        startLocalVideo();
    });

    onDestroy(() => {
        hangUp();
    });
</script>

<Navbar />

<section class="flex items-center justify-start sm:justify-center mt-12">
    <div
        class="grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-2 gap-2 p-2"
    >
        <video
            id="local-video"
            bind:this={localVideo}
            autoplay
            muted
            class="rounded-xl bg-indigo-50 w-full h-full"
        />
        <video
            id="remote-video"
            bind:this={remoteVideo}
            autoplay
            class="rounded-xl bg-indigo-50 w-full h-full"
        />
    </div>
</section>

<div class="p-2 mt-2 flex justify-center">
    <button
        on:click={hangUp}
        class="p-4 rounded-full font-semibold font-body text-md bg-red-600 text-white shadow-xl hover:bg-red-800 hover:shadow-2xl transition-all divide-purple-100"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
            />
        </svg>
    </button>
</div>
