import { writable } from 'svelte/store';

export let song = writable({});
export let playlist = writable([]);
export let editor = writable([]);
export let currentTime = writable(0);
export let playing = writable(false);
