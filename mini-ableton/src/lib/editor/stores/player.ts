import { AudioPlayer } from "$lib/editor/api/audio";
import project from "$lib/editor/stores/project";
import { get, writable } from "svelte/store";

const player = new AudioPlayer(new AudioContext(), get(project));

export default writable(player);
