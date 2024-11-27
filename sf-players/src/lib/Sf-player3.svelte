<script lang="ts">
    import WebMscore from 'webmscore';

    let isPlaying: boolean = false;
    let midi: Uint8Array

    async function fileInput(e: { target: { files: File[]; }; }) {
        const file = e.target.files[0];
        const arrayBuffer = await file.arrayBuffer();
        const unit8Array = new Uint8Array(arrayBuffer);
        console.log(unit8Array, "unit8Array");
        initSynth(unit8Array)
    };

    async function midiInput(e: { target: { files: File[]; }; }) {
        const file = e.target.files[0];
        const arrayBuffer = await file.arrayBuffer();
        const unit8Array = new Uint8Array(arrayBuffer);
        console.log(unit8Array, "unit8Array");
        midi = unit8Array;
    };

    async function initSynth(arrayBuffer: Uint8Array){
        WebMscore.ready.then(async () => {
            const score = await WebMscore.load('midi', midi, [], false);
            await score.setSoundFont(arrayBuffer);
            // const metadata = await score.metadata()
            // console.log(metadata, "score");
            console.log(score, "score");
        })
    }

    async function play(score) {
        // score.synthAudio(0)
        // score.(0, 68)
        // score.play();
        const metadata = await score.metadata()
        console.log(metadata, "score");
    }   
</script>
<input type="file" on:input={midiInput}>

<div class="flex flex-col gap-32 items-center justify-center w-screen h-screen">
    <h1 class="text-2xl">WebMscore</h1>
    <div class="flex flex-col items-center justify-center gap-2">
        <button on:click={play}>
            {#if isPlaying}
                <svg xmlns="http://www.w3.org/2000/svg"  class="fill-gray-900" height="64" viewBox="0 -960 960 960" width="64">
                    <path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/>
                </svg>
            {:else}
                <svg xmlns="http://www.w3.org/2000/svg"  class="fill-gray-900" height="64" viewBox="0 -960 960 960" width="64">
                    <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
                </svg>
            {/if}
        </button>
        <!-- <h2 class="h-5 text-xs">{soundfontTitle}</h2> -->
        <label class="flex items-center justify-center p-2 bg-gray-900 cursor-pointer">
            <input type="file" class="hidden" on:input={fileInput}>
            <span class="flex items-center uppercase gap-2 text-xs text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="fill-white" height="24" viewBox="0 -960 960 960" width="24">
                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
                </svg> 
                soundfont
            </span>
        </label>
    </div>
</div>