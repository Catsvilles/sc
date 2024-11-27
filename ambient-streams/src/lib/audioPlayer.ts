import { audioContext } from '$lib/audiocontext';

import { writable } from 'svelte/store';

export const player = writable(null);

class AudioPlayer {
    private loadedTracks: Track[] = [];
    private isPlaying: boolean = false;
    private clip: Clip;

    constructor(clip: Clip) {
        this.clip = clip
    }

    async loadTracks(): Promise<void> {
        const promises = this.clip.tracks.map(async (track) => {
            const response = await fetch(track.audioSrc);
            const arrayBuffer = await response.arrayBuffer();
            track.audio = await audioContext.decodeAudioData(arrayBuffer);
            const gainNode = audioContext.createGain();
            gainNode.gain.value = track.volume;
            track.gainNode = gainNode;

            return track;
        });

        this.loadedTracks = await Promise.all(promises);
    }

    play(): void {
        this.loadedTracks.forEach((track) => {
            const sourceNode = audioContext.createBufferSource();
            sourceNode.buffer = track.audio!;
            sourceNode.loop = true;
            sourceNode.connect(track.gainNode!);
            track.gainNode!.connect(audioContext.destination);
            sourceNode.start(0);
            track.sourceNode = sourceNode;
        });
        this.isPlaying = true;
    }

    stop(): void {
        this.loadedTracks.forEach((track) => {
            track.sourceNode!.stop(0);
            track.sourceNode = null;
        });
        this.isPlaying = false;
    }

    volumeChange(trackId: string, value: number): void {
        const track = this.loadedTracks.find(t => t.id === trackId);
        if (track && track.gainNode) {
            track.gainNode.gain.value = value;
        }
    }

    togglePlayback(): void {
        this.isPlaying ? this.stop() : this.play();
    }
}

export { AudioPlayer };