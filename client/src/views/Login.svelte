<script>
    import { navigate } from "svelte-routing";

    import { currentUser } from "../stores";
    import Input from "../components/Input.svelte";
    import Navbar from "../components/Navbar.svelte";

    export let from;

    let username = "",
        password = "";
    let error = { email: "", password: "" };
    let disabled = false;

    const handleSubmit = async (event) => {
        disabled = true;

        console.log({ username, password });

        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.status == 201) {
            const { user } = await response.json();
            localStorage.setItem("user", JSON.stringify(user));
            $currentUser = user;
            return navigate(from ?? "/", { replace: true });
        }

        const data = await response.json();
        if (data.error) {
            error = data.error;
            console.log(error);
        }

        disabled = false;
    };
</script>

<Navbar />

<section class="mt-12 flex justify-center">
    <div class="card w-full max-w-md">
        <div class="h-2" />

        <h1
            class="text-indigo-700 text-4xl text-center font-head font-semibold"
        >
            Login
        </h1>

        <div class="h-6" />

        <form on:submit|preventDefault={handleSubmit}>
            <Input
                label="Username"
                placeholder="a_unique_username"
                type="text"
                bind:value={username}
                error={error.username}
            />

            <div class="h-2" />

            <Input
                label="Password"
                type="password"
                placeholder="A strong password"
                bind:value={password}
                error={error.password}
            />

            <div class="h-2" />

            <div class="mx-2 mt-2 flex justify-center">
                <button type="reset" {disabled} class="btn-secondary"
                    >Clear</button
                >
                <button type="submit" {disabled} class="btn-primary">
                    Submit
                </button>
            </div>

            <div class="h-2" />
        </form>
    </div>
</section>
