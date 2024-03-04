<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { Source } from "@api/graph";
  import type { Track } from "@api/timeline";
  import project from "@app/stores/project";
  import stack from "@app/stores/undoredo";
  import Checkbox from "@components/control/Checkbox.svelte";
  import Knob from "@components/control/Knob.svelte";
	import InPlaceEdit from "@components/InPlaceEdit.svelte";

  export let selected: boolean = false;
  export let track: Track<Source<any>>;

  const dispatch = createEventDispatcher();

  // this is just the best way to handle right clicks on the web. boo!!
  function handleMuteContextMenu(this: HTMLElement, e: MouseEvent) {
    // no we're not contextmenu-ing
    e.preventDefault();

    dispatch("solo", track);
  }
</script>

<article
  class="track-head bg-[#333333]"
  class:selected
  class:disabled={!track.enabled}
  on:pointerdown
  style={`--track-height: ${track.height}px`}
>
  <div class="flex flex-row justify-start items-center gap-2 pl-2 bg-[#262626] h-min py-1 mt-2 rounded-full mx-2">
    <Checkbox
      size={10}
      bind:checked={track.enabled}
      on:contextmenu={handleMuteContextMenu}
    />
    <InPlaceEdit
    value={track.name}
    on:submit={({ detail: value }) => {
      track.name = value;
      const np = structuredClone($project);
      $stack.push(np);     
    }}
    on:df={() => {
      selected = false;
    }}
    />
  </div>
  <div class="flex flex-row items-center justify-center gap-4 p-1">
    {#each track.mod.parameters as param}
      <Knob
        name={param.name}
        type={param.type}
        min={param.min}
        max={param.max}
        bind:value={param.value}
        disabled={!track.enabled}
      />
    {/each}
  </div>
</article>

<style lang="scss">
  .track-head {
    display: grid;
    // background: var(--color-background-1);
    height: var(--track-height);
    // border-radius: var(--corner-radius);
    flex-shrink: 0;

    overflow: hidden;
    position: relative;

    &::before {
      content: "";

      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;

      width: calc(var(--corner-radius) / 2);
      background: var(--color-accent);

      opacity: 0.25;

      transition: opacity var(--anim-short);
    }

    &.selected {
      // background: var(--color-background-2);

      &::before {
        opacity: 1;
      }
    }

    h2,
    h3 {
      margin: 0;
    }

    h2 {
      font-size: 12px;
    }

    h3 {
      font-size: 10px;
      color: var(--color-foreground-2);
    }

    h2,
    h3,
    .knobs {
      transition: opacity var(--anim-short);
    }

    &.disabled {
      --color-accent: var(--color-foreground-1);

      h2,
      h3,
      .knobs {
        opacity: 0.5;
      }
    }
  }
</style>
