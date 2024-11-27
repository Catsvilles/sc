<script lang="ts">
  import type { Clip } from "$lib/editor/api/timeline";
  import { AudioClip } from "$lib/editor/api/audio";
  import AudioWaveform from "./AudioWaveform.svelte";

  export let clip: Clip;
  export let selected: boolean = false;
  export let viewRegion: [number, number];
  export let snap: number;
  export let secWidth: number;
  export let color = "var(--color-red)";

  let visibleRange: [number, number];
  $: visibleRange = [
    Math.max(viewRegion[0] - clip.start - clip.extentPast, 0) + clip.extentPast,
    clip.extent + Math.min(viewRegion[1] - clip.start - clip.extent, 0),
  ]; 
</script>
<div
  on:pointerdown
  class="clip"
  class:selected
  style={`
    --clip-color: ${color};
    transform: translateX(${Math.round(
      (clip.start + clip.extentPast) * secWidth
    )}px);
  `}
>
 <div class="resize-handle" />
  <div
    class="content"
    style={`width: ${Math.round(Math.max(clip.totalExtent * secWidth, 1))}px`}
  >
    <div
      class="data"
      style={`
        transform: translateX(${-clip.extentPast * secWidth}px);
        width: ${clip.length * secWidth}px;
      `}
    >
      {#if clip instanceof AudioClip}
        <AudioWaveform blob={clip.blob} {visibleRange} />
      {/if} 
    </div>
  </div>
</div>

<style lang="scss">
  .clip {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;

    color: #0BECEC;

    --background-opacity: 0.05;
    --background-tint: 0.5;

    &.selected {
      --background-tint: 0.15;
    }

    &::before {
      content: "";

      display: inline-block;
      border-radius: var(--corner-radius);

      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      background-color: #0BECEC;
      opacity: var(--background-tint);

      transition: opacity var(--anim-short);
    }

    .content {
      display: flex;
      flex-direction: column;

      border-radius: var(--corner-radius);
      overflow: hidden;

      position: relative;

      header {
        flex-shrink: 0;

        position: relative;
        color: var(--header-foreground-color);

        &::before {
          content: "";

          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          background: var(--header-background-color);
          opacity: var(--header-background-opacity);

          transition: opacity var(--anim-short);
        }

        h3 {
          position: sticky;
          font-size: 11px;
          padding: 2px 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      &::before {
        content: "";

        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;

        border-radius: inherit;
        background: rgba(123, 97, 255, 0.1);;

        transition: opacity var(--anim-short);
      }

      .data {
        flex-shrink: 0;
        flex-grow: 1;
      }
    }

    .resize-handle {
      flex-basis: 0;

      position: relative;
      width: 0px;

      cursor: ew-resize;

      &::after {
        content: "";

        position: absolute;
        top: 0;
        left: -4px;
        bottom: 0;
        width: 8px;

        z-index: 1;
      }
    }
  }
</style>
