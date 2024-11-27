import { Project } from "$lib/daw/api/project";
import { writable } from "svelte/store";

const project = writable(new Project());

export default project;
