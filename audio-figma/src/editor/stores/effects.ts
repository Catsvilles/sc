import { writable } from 'svelte/store';

export let volume = writable(1.0);
export let pan = writable(0);
export let automationVol = writable([]);