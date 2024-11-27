//import project from "@app/stores/project";
import { createStack } from 'svelte-undo';
import { writable } from "svelte/store";

// const initialProject = structuredClone($project);
//const stack = createStack({});

const stack = writable(createStack({}));
export default stack;
