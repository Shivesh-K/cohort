<script>
    import { onDestroy, onMount } from "svelte";
    import { navigate } from "svelte-routing";

    import { currentUser, offers } from "../stores";
    import Caller from "../classes/Caller";
    import Navbar from "../components/Navbar.svelte";
    import Input from "../components/Input.svelte";
    import OfferCard from "../components/OfferCard.svelte";

    let caller = new Caller();

    let localVideo;
    let receiverUsername = "";
    let error = "";

    let disabled = false;

    caller.onCalled = (payload) => {
        console.log("Call received");
        payload.timeout = setTimeout(() => caller.missCall(payload), 30 * 1000);
        offers.update((currOffers) => [...currOffers, payload]);
    };

    caller.onAccepted = async ({ callid, initiator, receiver }) => {
        console.log("Call accepted");
        navigate(`/call/${callid}`, {
            state: { callid, initiator, receiver },
        });
    };

    caller.onRejected = (payload) => {
        error = `${payload.receiver.name} rejected you call`;
        disabled = false;
    };

    caller.onMissed = (payload) => {
        error = `${payload.receiver.name} did not pick up`;
        disabled = false;
    };

    caller.onError = (err) => {
        error = err;
        disabled = false;
    };

    const makeCall = async () => {
        disabled = true;
        console.log("Make call");
        caller.call(receiverUsername);
    };

    const startLocalVideo = async () => {
        if (navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                localVideo.srcObject = stream;
            } catch (error) {
                // localVideo.srcObject = new MediaStream();
                console.error(error);
            }
        }
    };

    onMount(startLocalVideo);

    onDestroy(() => {
        caller.dispose();
        console.log("Destroyed");
    });
</script>

<Navbar />

<div
    class="mt-8 mx-auto h-full w-full lg:w-3/4 grid grid-rows-2 grid-cols-1 md:grid-rows-1 md:grid-cols-3 gap-2"
>
    <section class="row-span-1 md:col-span-2 p-2">
        <video
            id="local-video"
            autoplay
            bind:this={localVideo}
            muted
            class="rounded-xl w-full bg-indigo-50 shadow-sm transition-transform duration-100"
        >
            No video
        </video>
    </section>

    <section class="row-span-1 md:col-span-1 p-2">
        <div class="p-4">
            <form
                on:submit|preventDefault={makeCall}
                class="flex justify-center"
            >
                <Input
                    label="Who do you want to call?"
                    type="text"
                    {error}
                    bind:value={receiverUsername}
                />
                <div class="pt-10">
                    <button type="submit" class="btn-primary ml-2" {disabled}>
                        Call
                    </button>
                </div>
            </form>
        </div>

        <hr class="border-indigo-50" />

        <ul class="flex flex-col items-center">
            {#each $offers as offer}
                <OfferCard
                    name={offer.initiator.name}
                    acceptCall={() => caller.acceptCall(offer)}
                    rejectCall={() => caller.rejectCall(offer)}
                />
            {/each}
        </ul>
    </section>
</div>
