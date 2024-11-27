<script lang="ts">
  import TempoInput from "./TempoInput.svelte";
  import RecordButton from "./RecordButton.svelte";
  import PlayButton from "./PlayButton.svelte";
  // import Metronome from "./Metronome.svelte";
  import project from "$lib/editor/stores/project";
  import player from "$lib/editor/stores/player";
  import toWav from 'audiobuffer-to-wav';
  import { AudioPlayer } from "$lib/editor/api/audio";
  import eqState from "$lib/editor/stores/eq";
  import { WEQ8Runtime } from '$lib/editor/weq8/src/runtime'; // or from "https://cdn.skypack.dev/weq8"

  function stop() {
    $player.stop();
    $player.startCursor = 0;
  }
  function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
  async function exportAudio(){
  let finalDur: number;


    const durations = [];
    for (const track of $project.tracks) {
      for (let i = 0; i < track.clips.length; i++) {
        const clip = track.clips[i];
        const start = clip.extentPast + clip.start;
        const end = start + clip.extent - clip.extentPast;
        durations.push(end)
      }
    }
    finalDur = Math.max(...durations);
  
    const offlineCtx = new OfflineAudioContext(2,44100*finalDur,44100);
    
    const offlinePlayer = new AudioPlayer(offlineCtx, $project);    
    let weq8 = new WEQ8Runtime(offlineCtx, $eqState);
    offlinePlayer.masterGain.connect(weq8.input);
    weq8.connect(offlinePlayer.context.destination);

    offlinePlayer.start($project, 0);
    await delay(200);

    return offlineCtx.startRendering().then(function(renderedBuffer) {

    const wav = toWav(renderedBuffer);
    const blob = new window.Blob([ new DataView(wav) ], {
      type: 'audio/wav'
    })
    downloadBlob(blob, 'res.wav');
    }).catch(function(err) {
        console.log('Rendering failed: ' + err);
        // Note: The promise should reject when startRendering is called a second time on an OfflineAudioContext
    });
  }

  function downloadBlob(blob, name){
    const anchor = document.createElement('a')  
    const url = window.URL.createObjectURL(blob)
    anchor.href = url
    anchor.download = name;
    anchor.click()
    window.URL.revokeObjectURL(url)
  }
</script>

<nav class="flex items-center justify-between first-bg-color py-2">
  <div class="flex-grow flex items-center justify-center gap-2">
    <button class="p-1.5 second-bg-color rounded-lg" on:pointerdown={stop}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="icon-fill-active w-4 h-4">
        <path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/>
      </svg>
    </button>
    <PlayButton />
    <TempoInput bind:value={$project.tempo} />
  </div>
  <button class="p-1.5 second-bg-color rounded-lg ml-auto mr-2 px-4 text-sm text-[var(--yellowc)] focus:none" on:pointerdown={exportAudio}>
    Export
  </button>
</nav>


