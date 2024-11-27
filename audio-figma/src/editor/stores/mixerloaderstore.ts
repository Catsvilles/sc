import { writable } from "svelte/store";

let hideLoader: boolean;
const loader = writable(hideLoader);

export default loader;