<script lang="ts">
    import { onMount } from 'svelte';
    import * as Tone from 'tone';
    import type { Synthesizer } from "js-synthesizer";

    let audioContext: AudioContext;
    let synth: Synthesizer;
    let sequence: Tone.Sequence<number>;
    let isPlaying: boolean = false;
    let soundfontTitle: string = '';

    onMount(async() => {
        audioContext = new AudioContext();
        await audioContext.audioWorklet.addModule('libfluidsynth-2.3.0.js');
        await audioContext.audioWorklet.addModule('js-synthesizer.worklet.js');

        let JSSynth = window.JSSynth;
        synth = new JSSynth.AudioWorkletNodeSynthesizer();
        synth.init(audioContext.sampleRate);
        let node = synth.createAudioNode(audioContext, 4096);
        node.connect(audioContext.destination);        
    });

    async function fileInput(e: { target: { files: File[]; }; }) {
        const file = e.target.files[0];
        const arrayBuffer = await file.arrayBuffer();        
        await synth.loadSFont(arrayBuffer);
    };

    // async function initSynth(arrayBuffer: ArrayBuffer){
    //     let JSSynth = window.JSSynth;
    //     synth = new JSSynth.AudioWorkletNodeSynthesizer();
    //     synth.init(audioContext.sampleRate);
    //     let node = synth.createAudioNode(audioContext, 4096);        
    //     node.connect(audioContext.destination);
    //     await synth.loadSFont(arrayBuffer);
    // };

    function play() {
        isPlaying = !isPlaying;
        if (isPlaying) {
            sequence = new Tone.Sequence((time, note) => {
                synth.midiNoteOn(0, note, 100);                
                //synth.midiAllNotesOff(0);
            }, [56, 0, 68, 0, 66, 0, 68, 0, 61, 0, 63, 0, 59, 0, 56, 0]);
            sequence.start();
            Tone.Transport.start();
        } else {
            sequence.dispose();
            Tone.Transport.stop();
        };
    };
</script>

<div class="flex flex-col gap-32 items-center justify-center w-screen h-screen">
    <h1 class="text-2xl">js-synthesizer</h1>
    <div class="flex flex-col items-center justify-center gap-2">
        <button on:click={play}>
            {#if isPlaying}
                <svg xmlns="http://www.w3.org/2000/svg" class="fill-gray-900" height="64" viewBox="0 -960 960 960" width="64">
                    <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/>
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg" class="fill-gray-900" height="64" viewBox="0 -960 960 960" width="64">
                    <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
                </svg>
            {/if}
        </button>
        <h2 class="h-5 text-xs">{soundfontTitle}</h2>
        <label class="flex items-center justify-center p-2 bg-gray-900 cursor-pointer">
            <input type="file" class="hidden" on:input={fileInput} accept=".sf2">
            <span class="flex items-center uppercase gap-2 text-xs text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="fill-white" height="24" viewBox="0 -960 960 960" width="24">
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                </svg> 
                soundfont
            </span>
        </label>
    </div>
</div>