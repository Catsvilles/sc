<script lang="ts">
  import type { Clip } from "$lib/editor/api/timeline";
  import { createEventDispatcher } from "svelte";
  import { AbstractClip, Track } from "$lib/editor/api/timeline";
  import project from "$lib/editor/stores/project";
  import { AudioClip } from "$lib/editor/api/audio";
  import player from "$lib/editor/stores/player";
  import ClipComponent from "./Clip.svelte";
  import { Canvas, Layer, type Render } from 'svelte-canvas';

  export let track: Track<any>;
  export let viewRegion: [number, number];
  export let snap: number;
  export let secWidth: number;
  export let selectedClips: Set<Clip>;

  const dispatch = createEventDispatcher();

  let backgroundWidth: number;
  let backgroundHeight: number;
  let backgroundFrame: number;
  let ctx: CanvasRenderingContext2D;
  const audioTypes = /^audio\/.+/;

  let ghostClip: AbstractClip = null;

  async function insertAudioClip(time: number, name: string, blob: Blob) {
    const buffer = await $player.decodeBlob(blob);
    const clip = new AudioClip(name, blob, 0, buffer.duration);

    clip.start = time;
    track.clips = [...track.clips, clip];
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

    backgroundFrame = requestAnimationFrame(() => {
      backgroundFrame = null;

      ctx.save();
      {
        ctx.scale(1, height);
        ctx.strokeStyle = 'lightgray';
        //ctx.fillStyle = '';

        drawDivisions(
          ctx,
          backgroundWidth,
          snap * secWidth,
          viewRegion[0] * secWidth
        );
        ctx.globalAlpha = 0.5;
        ctx.stroke();

        drawDivisions(
          ctx,
          backgroundWidth,
          $project.barsToTime(1) * secWidth,
          viewRegion[0] * secWidth
        );
        ctx.globalAlpha = 1;
        ctx.stroke();
      }
      ctx.restore();
    });
  }

  let render: Render;
  $: render = ({ context, width, height }) => {    
    // redraw when any of these change
    backgroundWidth;
    backgroundHeight;
    viewRegion;

    redrawBackground(context, height);
  }
</script>
<div
bind:clientWidth={backgroundWidth} bind:clientHeight={backgroundHeight}
  class="track first-bg-color"
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
<Canvas
width={backgroundWidth}
height={backgroundHeight}>
  <Layer {render} />
</Canvas>
  <div class="clips">
    {#each track.clips as clip (clip)}
      <ClipComponent
        bind:clip
        selected={selectedClips.has(clip)}
        {secWidth}
        {snap}
        {viewRegion}
        on:pointerdown={(e) => dispatch("pointerdownclip", { clip, e })}
      />
    {/each}
  </div>
</div>

<style lang="scss">
  .track {
    border-radius: var(--corner-radius);
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

      color: var(--color-background-0);
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
      opacity: 0.5;
      pointer-events: none;
    }
  }
</style>
