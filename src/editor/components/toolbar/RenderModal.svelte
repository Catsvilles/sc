<svelte:head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lamejs/1.2.1/lame.min.js" integrity="sha512-xT0S/xXvkrfkRXGBPlzZPCAncnMK5c1N7slRkToUbv8Z901aUEuKO84tLy8dWU+3ew4InFEN7TebPaVMy2npZw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
</svelte:head>
<style>
    .modal {
      transition: opacity 0.25s ease;
    }
    .dropdown:hover .dropdown-menu {
		  display: block;
	  }
</style>
<script lang="ts">
  import project from "@app/stores/project";  
  import player from "@app/stores/player";
  import toWav from 'audiobuffer-to-wav';
  import JSZip from "jszip";
  import { AudioTrack } from "@api/audio";
  import { blobToBase64, renderNewProject } from "@app/utils/ProjectMap";  

  export let hideModal;
  export let actionTitle = 'Export Project';
  let tabs = ["file", "wav", "mp3" , "stems"];
  let active = "wav";
  let decodingMp3 = false;
  let exportInLoop = false;

  const toggle= (tab)=>{
  active=tab
}
  function closeModal() {
      hideModal = true;
  }

function renderAudio(){
  let finalDur: number;

  if ($player.loopingPoints.length > 0 && exportInLoop) {
    finalDur = $player.loopingPoints[1] - $player.loopingPoints[0];
  } else {
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
  }
  const offlineCtx = new OfflineAudioContext(2,44100*finalDur,44100);
  $player.setContext(offlineCtx);
  
  if ($player.loopingPoints.length > 0 && exportInLoop) {
    $player.start($project, $player.loopingPoints[0], $player.loopingPoints[1]);
  } else {
    $player.start($project, 0);
  }

  return offlineCtx.startRendering().then(function(renderedBuffer) {
  $player.stop();
  $player.setContext(new AudioContext());  
  return renderedBuffer;
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

async function exportMp3(bitrate : number){
  decodingMp3 = true;
  const buff = await renderAudio();     
  const mp3encoder = new lamejs.Mp3Encoder(buff.numberOfChannels, buff.sampleRate, bitrate);
  var mp3Data = [];
  var lo = buff.getChannelData(0); //the decoded data range: -1 +1
      var ro = buff.getChannelData(1);
      var left = new Float32Array(lo.length); //The transformed data, this is what you will pass to lame instead
      var right = new Float32Array(ro.length);
      //Convert to required format
      for(var i=0;i<lo.length;i++) {
          left[i] = lo[i]*32767.5;
          right[i] = ro[i]*32767.5;
      }
  const sampleBlockSize = 1152; //can be anything but make it a multiple of 576 to make encoders life easier
  for (var i = 0; i < lo.length; i += sampleBlockSize) {
  const leftChunk = left.subarray(i, i + sampleBlockSize);
  const rightChunk = right.subarray(i, i + sampleBlockSize);
  var mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }
  }
  var mp3buf = mp3encoder.flush();   //finish writing mp3
  if (mp3buf.length > 0) {
    mp3Data.push(mp3buf);
  }
  const blob = new Blob(mp3Data, {type: 'audio/mp3'});
  decodingMp3 = false;
  downloadBlob(blob, 'soundgrape.mp3');
}

async function exportWav() {
  const renderedBuffer = await renderAudio();     
  const wav = toWav(renderedBuffer);
  const blob = new window.Blob([ new DataView(wav) ], {
    type: 'audio/wav'
  })
  downloadBlob(blob, 'soundgrape.wav');
}

async function exportStems() {
  const renderedStems = [];
      const durations = [];

  const newTrack = new AudioTrack();
  //NOTE: adding a new track to fix bug with scheduling the first track
  $project.tracks.unshift(newTrack);

  //Get duration for each track
  for (const track of $project.tracks) {
    //Get Total Duration of current track
    for (let i = 0; i < track.clips.length; i++) {
      const clip = track.clips[i];
      const start = clip.extentPast + clip.start;
      const end = start + clip.extent - clip.extentPast;
      durations.push(end)
    } 
  }

  //Disable all tracks so we can play them solo one by one
  for (let i = 0; i < $project.tracks.length; i++) {
      $project.tracks[i].enabled = false;
  }
  //Render track
  const finalDur = Math.max(...durations);
  for (let i = 0; i < $project.tracks.length; i++) {
    const track = $project.tracks[i];
    //Enable only current track for playing solo
    track.enabled = true;
    const offlineCtx = new OfflineAudioContext(2, 44100*finalDur, 44100);
    $player.setContext(offlineCtx);
    $player.start($project, 0);
    const renderedBuffer = await offlineCtx.startRendering();
    $player.stop();
    track.enabled = false;
    const wav = toWav(renderedBuffer)
    const blob = new window.Blob([ new DataView(wav) ], {
      type: 'audio/wav'
    })
    if (track.clips.length > 0) {
      renderedStems.push(blob);
    }
  }
  $project.tracks = $project.tracks.filter((track) => track !== newTrack);

  $player.setContext(new AudioContext());
  //Enable all track again
  for (let i = 0; i < $project.tracks.length; i++) {
    $project.tracks[i].enabled = true;
  }
  var zip = new JSZip();
  renderedStems.forEach(function(url, index){
    var filename = "stem_" + index + ".wav";
    zip.file(filename, url);
  });
  const content = await zip.generateAsync({type:'blob'});
  downloadBlob(content, 'soundgrape_stems.zip');
}

async function exportProject() { 
const projToSave = structuredClone($project);

 for (let i = 0; i < projToSave.tracks.length; i++) {
    const track = projToSave.tracks[i];
    for (let c = 0; c < track.clips.length; c++) {
      const clip = track.clips[c];
      const base64 = await blobToBase64(clip.blob);
      projToSave.tracks[i].clips[c].blob = base64;
    }
  }
  
  let blob = new Blob([JSON.stringify(projToSave)], { type: 'application/json' });
  const today = new Date();
  const name = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  downloadBlob(blob, `${name}.sg`);
}
let files;
</script>
  <!--Modal-->
  <div class="z-50 modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
    <div on:click={closeModal} class="absolute glassmorphism w-full h-full bg-cover bg-opacity-75 blur-sm"></div>
    <div class="modal-container w-full md:w-6/12 h-96 mx-auto shadow-lg z-40 overflow-y-hidden pb-4 rounded-lg">
      <!-- Add margin if you want to see some of the overlay behind the modal-->
      <div class="py-4 text-center px-6 text-white font-semibold">
        <!--Title-->
        <div class="flex justify-end items-center pb-3">
          <div on:click={closeModal} class="cursor-pointer z-50">
            <svg class="fill-current text-neutral-300" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
            </svg>
          </div>
        </div>
        <div class="flex justify-center text-2xl text-orange-500 text-center mb-4 uppercase">
          {actionTitle}
        </div>
        <!--Body-->
        <div class="mb-2">
            <div class="text-lg flex justify-center text-center text-white">
                <ul class="flex flex-wrap -mb-px">
                {#each tabs as tab }
                    <li on:click={() => toggle(tab)} class="mr-2">
                        <button class:active={tab === active} class="{tab === active ? "text-orange-500 border-orange-500" : ""} inline-block p-4 rounded-t-lg border-b-4 uppercase" aria-current="page">{tab}</button>
                    </li>
                {/each}
                </ul>
            </div>
            <div class="w-full mx-auto">
            <div class="flex flex-col items-center justify-center gap-4">
                {#if active === "file"}
                <p class="mt-4">
                  Soundgrape project file
                </p>
                <div on:click={exportProject} class="flex items-center px-10 bg-[#262626] py-2 mx-auto uppercase rounded-md cursor-pointer border border-orange-500 text-orange-500">
                  Export
                </div>
                {:else if active === "wav"}
                <p class="mt-4">
                  Raw uncompressed audio quality
                </p>
                <div class='flex flex-row'>
                  <input type="checkbox" bind:checked={exportInLoop} id="cb1" value="cb1"
                      class='
                          appearance-none h-6 w-6 bg-gray-400 rounded-full 
                          checked:bg-orange-500 checked:scale-75
                          transition-all duration-200 peer
                      '
                  />
                  <div class='h-6 w-6 absolute rounded-full pointer-events-none
                      peer-checked:border-orange-400 peer-checked:border-2
                      '>
                  </div>
                  <label for='cb1' class='flex flex-col justify-center px-2 peer-checked:text-orange-500 select-none uppercase'>Export Inside Loop</label>
                </div>
                <div on:click={exportWav} class="flex items-center px-10 bg-[#262626] py-2 mx-auto uppercase rounded-md cursor-pointer border border-orange-500 text-orange-500">
                  Export
                </div>
                {:else if active === "mp3"}
                <p class="mt-4">
                  Mp3 compressed audio for lesser file size
                </p>
                {#if decodingMp3}
                <p class="animate-pulse mt-4 text-slate-200">
                  Working... Please be patient, converting to MP3 may take some time.
                </p>
                {/if}
                <div class='flex flex-row'>
                  <input type="checkbox" bind:checked={exportInLoop} id="cb1" value="cb1"
                      class='
                          appearance-none h-6 w-6 bg-gray-400 rounded-full 
                          checked:bg-orange-500 checked:scale-75
                          transition-all duration-200 peer
                      '
                  />
                  <div class='h-6 w-6 absolute rounded-full pointer-events-none
                      peer-checked:border-orange-400 peer-checked:border-2
                      '>
                  </div>
                  <label for='cb1' class='flex flex-col justify-center px-2 peer-checked:text-orange-500 select-none uppercase'>Export Inside Loop</label>
                </div>
                <div class="dropdown mr-2 inline-block cursor-pointer relative">
                  <div class="flex items-center gap-2 px-10 bg-[#262626] py-2 mx-auto uppercase rounded-md cursor-pointer border border-orange-500 text-orange-500">
                    Bitrate
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <ul class="dropdown-menu hidden absolute z-50 ml-1 pt-1 w-11/12 bg-orange-700 bg-opacity-75">
                    <span on:click={() => exportMp3(160)} class="rounded-t py-2 px-4 block whitespace-no-wrap hover:bg-orange-500">160Kbps</span>
                    <span on:click={() => exportMp3(256)} class="rounded-t py-2 px-4 block whitespace-no-wrap hover:bg-orange-500">256Kbps</span>
                    <span on:click={() => exportMp3(320)} class="rounded-t py-2 px-4 block whitespace-no-wrap hover:bg-orange-500">320Kbps</span>
                  </ul>
                </div>
                {:else if active === "stems"}
                  <p class="mt-4">
                    Render every track individually
                  </p>
                  <div on:click={exportStems} class="flex items-center px-10 bg-[#262626] py-2 mx-auto uppercase rounded-md cursor-pointer border border-orange-500 text-orange-500">
                    Export Stems
                  </div>
                {/if}
            </div>
            </div>
        </div>
      </div>
    </div>
  </div>
