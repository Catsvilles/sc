import { AudioPlayer } from "$lib/daw/api/audio";
import project from "$lib/daw/stores/project";
import { get, writable } from "svelte/store";

const player = new AudioPlayer(new AudioContext(), get(project));

export default writable(player);
