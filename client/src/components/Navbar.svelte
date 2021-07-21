<script>
    import { Link } from "svelte-routing";
    import { get } from "svelte/store";

    import { currentUser } from "../stores";
    import { logout } from "../helpers/auth";

    const user = get(currentUser);
    console.log(user);
</script>

<nav class="flex flex-row justify-between px-8 py-2 shadow-md">
    <div class="flex items-center">
        <Link to="/" class="stroke-2 text-indigo-700">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        </Link>
    </div>
    <div class="flex flex-row items-center">
        {#if user?.id}
            <button on:click={logout} class="btn-secondary">Logout</button>
        {:else}
            <Link to="/signup" class="btn-secondary">Create an account</Link>
            <Link to="/login" class="btn-primary">Login</Link>
        {/if}
    </div>
</nav>
