<script>
    import { fade } from "svelte/transition";

    export let name;
    export let acceptCall;
    export let rejectCall;
</script>

<div transition:fade={{ duration: 200 }} class="card w-3/4 max-w-md">
    <div class="flex flex-row justify-start gap-2">
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
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
        </svg>
        <h3>
            <strong class="font-semibold text-indigo-700">{name}</strong> is calling
        </h3>
    </div>
    <div class="flex flex-row justify-center mt-4">
        <button on:click={acceptCall} class="btn-primary">Accept</button>
        <button on:click={rejectCall} class="btn-secondary">Reject</button>
    </div>
</div>
