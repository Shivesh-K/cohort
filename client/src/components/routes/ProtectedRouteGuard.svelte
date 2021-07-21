<script>
    import { navigate } from "svelte-routing";

    import { verifyUser } from "../../helpers/auth";

    let isUserVerified;

    verifyUser()
        .then((res) => (isUserVerified = res))
        .catch((_) => (isUserVerified = false));

    $: if (isUserVerified != undefined && !isUserVerified) {
        navigate("/login", {
            state: { from: location.pathname },
            replace: true,
        });
    }
</script>

{#if isUserVerified}
    <slot />
{/if}
