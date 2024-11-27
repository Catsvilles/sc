<script lang="ts">
  import type { Clip } from "@api/timeline";
  import { createEventDispatcher } from "svelte";
  import { AbstractClip, Track } from "@api/timeline";
  import { AudioClip } from "@api/audio";
  import loader from "@app/stores/mixerloaderstore"
  import project from "@app/stores/project";
  import player from "@app/stores/player";
  import ClipComponent from "./Clip.svelte";
  import stack from "@app/stores/undoredo";
  import { Canvas, Layer, type Render } from 'svelte-canvas';	
  export let track: Track<any>;
  export let viewRegion: [number, number];
  export let snap: number;
  export let secWidth: number;
  export let selectedClips: Set<Clip>;

  const dispatch = createEventDispatcher();

  let backgroundCanvas: HTMLCanvasElement;
  let backgroundWidth: number;
  let backgroundHeight: number;
  let backgroundFrame: number;
  let ctx: CanvasRenderingContext2D;

  let ghostClip: AbstractClip = null;
  const audioTypes = /^audio\/.+/;

  let stream : MediaStream;	
  let recorder : MediaRecorder;	
  async function recordOntoTrack() {	
    const time = $player.startCursor;	
    	
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });	
    recorder = new MediaRecorder(stream);	
    recorder.start();	
    if (!ghostClip) {	
        ghostClip = new AbstractClip("Recording...");	
        ghostClip.length = ghostClip.extent = $project.barsToTime(16);	
    }	
    ghostClip.start = time;	
		recorder.ondataavailable = (e) => {	
      ghostClip = null;	
			const blob = e.data;	
      const today = new Date();	
      const name = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();	
      insertAudioClip((time), name, blob);	
      $player.decodeBlob(blob).then((buffer) => {	
        $player.startCursor = time + buffer.duration;	
      });	
		}	
  }	
  function renderRecording() {    	
    if(recorder === undefined || recorder.state === "inactive"){	
      return;	
    }	
    ghostClip = null;	
    recorder.stop();	
  }	
  $: if ($player.isRecording && track.selected) {	
    recordOntoTrack();	
  } else {	
    renderRecording();	
  }	

  async function insertAudioClip(time: number, name: string, blob: Blob) {
    loader.set(true);
    const buffer = await $player.decodeBlob(blob);
    const clip = new AudioClip(name, blob, 0, buffer.duration);
    clip.start = time;
    track.clips = [...track.clips, clip];
    const np = structuredClone($project);
    $stack.push(np);
    loader.set(false);
  }

  function computeDropTime(e: MouseEvent) {
    const target = e.currentTarget;
    let time = viewRegion[0] + e.clientX / secWidth;

    if (target instanceof HTMLElement) {
      const rect = target.getBoundingClientRect();

      time -= rect.x / secWidth;
    }

    if (!e.altKey) {
      time = Math.round(time / snap) * snap;
    }

    return time;
  }

  function handleDragOver(e: DragEvent) {
      const time = computeDropTime(e);

      if (!ghostClip) {
        ghostClip = new AbstractClip("Audio clip");
        ghostClip.length = ghostClip.extent = $project.barsToTime(1);
      }

      ghostClip.start = time;

      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";    
  }

  function handleDragLeave(e: DragEvent) {
    ghostClip = null;
  }

  async function handleDrop(this: HTMLElement, e: DragEvent) {
    e.preventDefault();
    ghostClip = null;
    const time = computeDropTime(e);
    if (e.dataTransfer.types.includes("Files")) {      
          const files = e.dataTransfer.files;
          for (const file of files) {
            if (file.type.match(audioTypes)) {
              insertAudioClip(time, file.name, file);
            }
          }
      }  else {
      const trackData = JSON.parse(e.dataTransfer.getData("text"));
      const res = await fetch(trackData.url, {
          method: "GET",
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin':'*'
          }
      });

      const blob = await res.blob();
      insertAudioClip(time, trackData.title, blob);   
    }    
  }

  function drawRegions(
    ctx: CanvasRenderingContext2D,
    width: number,
    divwidth: number,
    scroll: number
  ) {
    const xoffset = scroll % (divwidth * 2);

    ctx.beginPath();
    for (let i = 1; i * divwidth - xoffset < width; i += 2) {
      ctx.rect(i * divwidth - xoffset, 0, divwidth, 1);
    }
  }

  function drawDivisions(
    ctx: CanvasRenderingContext2D,
    width: number,
    divwidth: number,
    scroll: number
  ) {
    const xoffset = scroll % divwidth;

    ctx.beginPath();
    for (let i = 0; i * divwidth - xoffset < width; i++) {
      ctx.moveTo(i * divwidth - xoffset, 0);
      ctx.lineTo(i * divwidth - xoffset, 1);
    }
  }

  function redrawBackground(ctx: CanvasRenderingContext2D, height: number) {    
    backgroundFrame ?? cancelAnimationFrame(backgroundFrame);
    backgroundCanvas = ctx.canvas;

    backgroundFrame = requestAnimationFrame(() => {
      if (!backgroundCanvas) {
        return;
      }

      backgroundCanvas.width = backgroundWidth * window.devicePixelRatio;
      backgroundCanvas.height = backgroundHeight * window.devicePixelRatio;


      const style = getComputedStyle(backgroundCanvas);
      const color = style.getPropertyValue("#363636");
      const bg = style.getPropertyValue("--color-background-1");

      backgroundFrame = null;

      ctx.save();
      {
        ctx.scale(1, height);

        ctx.strokeStyle = color;

        drawDivisions(
          ctx,
          backgroundWidth,
          secWidth /2,
          viewRegion[0] * secWidth
        );
        ctx.globalAlpha = 0.5;
        ctx.stroke();

        drawDivisions(
          ctx,
          backgroundWidth,
          2 * secWidth,
          viewRegion[0] * secWidth
        );
        ctx.globalAlpha = 1;
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  // $: {   
  //   // redraw when any of these change
  //   $project.tempo;
  //   $project.signature;
  //   $player.isRecording;
  //   backgroundWidth;
  //   backgroundHeight;
  //   viewRegion;
  //   secWidth;

  //   redrawBackground();
  // }

  let render: Render;	
  $: render = ({ context, width, height }) => {    	
    // redraw when any of these change	
    backgroundWidth;	
    backgroundHeight;	
    viewRegion;
    
    redrawBackground(context, height);
  }
</script>
<!-- on:click={record} -->

<div
  class="track bg-[#333333]"
  class:disabled={!track.enabled}
  on:pointerenter
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
  style={`
    height: ${track.height}px;
    --xscroll: ${viewRegion[0] * secWidth}px;
    --snap-width: ${snap * secWidth}px;
    --bar-width: ${$project.barsToTime(1) * secWidth}px;
    --beat-width: ${$project.beatsToTime(1) * secWidth}px;
  `}
>
<div bind:clientWidth={backgroundWidth} bind:clientHeight={backgroundHeight}>	
  <Canvas
  width={backgroundWidth}	
  height={backgroundHeight}>	
    <Layer {render} />	
  </Canvas>	
</div>
  <div class="clips">
    {#each track.clips as clip (clip)}
      <ClipComponent
        bind:clip
        selected={selectedClips.has(clip)}
        recordingStream={stream}
        {secWidth}
        {snap}
        {viewRegion}
        currentTrack={track}
        on:pointerdown={(e) => dispatch("pointerdownclip", { clip, e })}
      />
    {/each}
  </div>

  <div class="ghost-clip">
    {#if ghostClip}
      <ClipComponent
        bind:clip={ghostClip}
        {secWidth}
        {snap}
        {viewRegion}
        recordingStream={stream}
        on:cliptake
      />
    {/if}
  </div>
</div>

<style lang="scss">
  .track {
    // border-radius: var(--corner-radius);

    // background: var(--color-background-2);

    transition: opacity var(--anim-short);

    position: relative;
    overflow: hidden;

    &.disabled {
      opacity: 0.5;
    }

    .grid {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: "#262626";
    }

    .clips,
    .ghost-clip {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;

      transform: translateX(calc(var(--xscroll) * -1));
    }

    .ghost-clip {
      opacity: 1;
      pointer-events: none;
    }
  }
</style>
