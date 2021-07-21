import { navigate } from "svelte-routing";
import { get } from 'svelte/store';

import { currentUser } from '../stores';

export const verifyUser = async () => {
    const response = await fetch('/auth/verify', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (response.status === 201)
        return true;
    else
        return false;
}

export const logout = async () => {
    const response = await fetch('/auth/logout', { method: "DELETE" });
    if (response.status === 201) {
        currentUser.set({});
        localStorage.setItem("user", JSON.stringify({}));
        console.log(get(currentUser));
        navigate('/login', { replace: true });
    }
    else
        throw Error("There was some error in logging you out");
}