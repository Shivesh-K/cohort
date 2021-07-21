export const getUserByUsername = async (username) => {
    const response = await fetch(`/user/username/${username}`, { method: "GET" });
    if (response.status == 200) {
        const { user } = await response.json();
        // console.log(user);
        return user;
    }
    else {
        const { error } = await response.json();
        console.log(error);
        throw Error(error);
    }
};

