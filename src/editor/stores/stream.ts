import { writable } from "svelte/store";

function createStreamStore() {
    const { subscribe, set } = writable<MediaStream>()

    /** Prompts the user to select a screen to capture and sets the media stream */
    async function start() {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true, video: false
        });        
        set(stream)
    }

    /** Sets the store to null */
    function stop() {
        set(null)
    }

    return {
        subscribe,
        start,
        stop
    }
}

export default createStreamStore();
