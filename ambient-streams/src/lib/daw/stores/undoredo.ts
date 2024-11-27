//import project from "$lib/daw/stores/project";
// import { createStack } from 'svelte-undo';
import { writable } from "svelte/store";

// const initialProject = structuredClone($project);
//const stack = createStack({});

const stack = writable({});
export default stack;
