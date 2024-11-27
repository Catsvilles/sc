<script lang="ts">
  import { onMount } from 'svelte';
  import { ACRecorder } from '$lib/audio-recorder';
  import {drawFrequencyLines, drawFrequencyBall, drawJumpingBall} from '$lib/animations'

  let ACR: ACRecorder;
  let animateRAF: number;
  let audio: HTMLAudioElement; 
  let canvas: HTMLCanvasElement;

  let isRecording = false;
  let isPaused = false;
  let previewVideo = false;
  

  onMount(() => {
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
  });

  function setCanvasDimensions() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function handleFileInput(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      audio.src = URL.createObjectURL(selectedFile);
      initACRecorder(audio, canvas);
    }
  };

  function initACRecorder( audio: string | HTMLAudioElement | AudioNode, canvas: string | HTMLCanvasElement){
    ACR = new ACRecorder(audio, canvas);
    ACR.setListeners({
      start: () => {
        console.warn("# recorder - start");
      },
      fail: () => {
        console.warn("# recorder - fail");
      },
      pause: () => {
        console.warn("# recorder - pause");
      },
      resume: () => {
        console.warn("# recorder - resume");
      },
      stop: () => {
        console.warn("# recorder - stop");
      },
    });
  };

  async function toggleRecording(){
    isRecording = !isRecording;

    if(isRecording){   
      audio.play();
      const res = await ACR.start();
      drawFrequencyLines(res, animateRAF);
    } else {
      audio.pause();
      cancelAnimationFrame(animateRAF);
      await ACR.stop();
    }
  };

  async function togglePauseRecording(){
    isPaused = !isPaused;

    if(isPaused){   
      audio.pause();
      cancelAnimationFrame(animateRAF);
      await ACR.pause();
    } else {
      audio.play();
      await ACR.resume();
    }
  };

  function togglePreviewVideo() {
    previewVideo = !previewVideo;

    if(previewVideo){   
      ACR.preview();
    } else {
      ACR.closePreview();
    }
  };

  function downloadVideo() {
    ACR.download();
  };
</script>


<div class="relative flex flex-col w-screen h-screen">
  <div class="w-full h-full">
    <canvas bind:this={canvas}></canvas>
  </div>
  
  <audio bind:this={audio} id="audio"></audio>

  <div class="absolute bottom-0 flex flex-row items-center justify-center gap-4 text-xs w-full">
    <label class="flex flex-col items-center">
      <input type="file" class="hidden" on:change={handleFileInput} accept="audio/*">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
      <span>
          Audiofile
      </span>
    </label>

    <button on:click={toggleRecording} class="flex flex-col items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
      {#if isRecording}
        <span>Stop Recording</span>
      {:else} 
        <span>Start Recording</span>
      {/if}
    </button>

    <button on:click={togglePauseRecording} class="flex flex-col items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811Z" />
      </svg>
      {#if isPaused}
        <span>Resume Recording</span>
      {:else} 
        <span>Pause Recording</span>
      {/if}
    </button>

    <button on:click={togglePreviewVideo} class="flex flex-col items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
      </svg>
      {#if previewVideo}
        <span>Close Preview</span>
      {:else} 
        <span>Preview Video</span>
      {/if}
    </button>

    <button on:click={downloadVideo} class="flex flex-col items-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      <span>Download Video</span>
    </button>
  </div>
</div>
  

  
