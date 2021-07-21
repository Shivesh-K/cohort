import { readable, writable } from 'svelte/store';

import { servers } from './config';

export const currentUser = writable(JSON.parse(localStorage.getItem("user")));

export const offers = writable([]);