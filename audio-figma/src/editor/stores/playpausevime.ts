import { writable } from "svelte/store";
import type vimePlayer from '@vime/svelte/dist/types/components/Player';

let player: vimePlayer;
const vimePlayerStore = writable(player);


export default vimePlayerStore;