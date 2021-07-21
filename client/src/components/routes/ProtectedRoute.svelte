<script>
    import { Route } from "svelte-routing";
    import ProtectedRouteGuard from "./ProtectedRouteGuard.svelte";

    export let path;
</script>

<Route {path} let:params let:location let:navigate>
    <ProtectedRouteGuard>
        <slot {params} {location} {navigate} />
    </ProtectedRouteGuard>
</Route>
