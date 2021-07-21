<script>
	import { Router, Route, Link } from "svelte-routing";
	import ProtectedRoute from "./components/routes/ProtectedRoute.svelte";
	import Tailwind from "./components/Tailwind.svelte";

	import Call from "./views/Call.svelte";
	import Home from "./views/Home.svelte";
	import Login from "./views/Login.svelte";
	import Signup from "./views/Signup.svelte";
	import Navbar from "./components/Navbar.svelte";
</script>

<Router>
	<ProtectedRoute path="/" let:location>
		<Home {...location.state} />
	</ProtectedRoute>
	<Route path="/login" component={Login} />
	<Route path="/signup" component={Signup} />
	<ProtectedRoute path="/call/:id" let:location>
		<Call {...location.state} />
	</ProtectedRoute>
</Router>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
