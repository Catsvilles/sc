<script lang="ts">
  import type { PageData } from "./$types"
  import { onMount } from "svelte"
  import RangeSlider from "svelte-range-slider-pips"
  import {
    App,
    Navbar,
    Tabbar,
    TabbarLink,
    Toolbar,
    Link,
    Range,
    List,
    ListItem,
    Button,
    Progressbar,
    Panel,
    Page,
    Block,
    BlockTitle,
    Sheet,
    Card,
  } from "konsta/svelte"
  import { player, AudioPlayer } from "$lib/audioPlayer"
  import Sidebar from "$lib/components/Sidebar.svelte"
  import ToggleFavorite from "$lib/components/ToggleFavorite.svelte"

  export let data: PageData
  let backgroundColor = {
    bgMaterial: "bg-[var(--background-color)]",
  }
  let card: HTMLDivElement
  let cardheight: number
  let clip: Clip = data.clip
  let isPlaying = false
  let currentTrack = ""
  let panelOpened = false
  let isFavorite = true

  onMount(async () => {
    $player = new AudioPlayer(clip)
    await $player.loadTracks()
  })

  function togglePlayback() {
    isPlaying = !isPlaying
    $player.togglePlayback()
  }

  function volumeChange(track: Track, value: number) {
    $player.volumeChange(track.id, value)
    currentTrack = track.title
  }

  onMount(async () => {
    updateCardWidth()
    window.addEventListener("resize", updateCardWidth)
  })

  function updateCardWidth() {
    if (card) {
      cardheight = card.offsetWidth
    }
  }
</script>

<Page
  colors={backgroundColor}
  class="flex flex-col items-center justify-start gap-10"
>
  <div
    class="fixed top-0 z-20 flex flex-row items-center justify-between p-4 w-full"
  >
    <a href="/playlist/{clip.category}">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 stroke-[url(#gradient)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="var(--gradient-from)" />
          <stop offset="100%" stop-color="var(--gradient-to)" />
        </linearGradient>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M15 6l-6 6l6 6" />
      </svg>
    </a>
    <button
      on:click={() => {
        panelOpened = !panelOpened
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 stroke-[url(#gradient)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      </svg>
    </button>
  </div>
  <div
    bind:this={card}
    class="flex items-center justify-center w-full h-[40%] bg-cover bg-center opacity-75"
    style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), var(--background-color)), url('{clip.thumbnail}')"
  >
    <span class="text-xl">{clip.title}</span>
  </div>
  <div>
    <div
      class="flex flex-row gap-2 rounded-md bg-[var(--navbar-color)] -mt-20 z-10 opacity-75"
    >
      {#each clip.tracks as track}
        <RangeSlider
          vertical
          min={0}
          max={1}
          step={0.01}
          bind:values={track.volume}
          on:change={(e) => volumeChange(track, e.detail.value)}
        />
      {/each}
    </div>
    <div class="h-4">{currentTrack}</div>
  </div>
  <div class="flex flex-row items-center justify-center gap-10 pb-15">
    <button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 stroke-[url(#gradient)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M8.7 10.7l6.6 -3.4" />
        <path d="M8.7 13.3l6.6 3.4" />
      </svg>
    </button>
    <button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 stroke-[url(#gradient)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M20 5v14l-12 -7z" />
        <path d="M4 5l0 14" />
      </svg>
    </button>
    <button on:pointerdown={togglePlayback}>
      {#if isPlaying}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-14 h-14 stroke-[url(#gradient)]"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M6 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"
          />
          <path
            d="M14 5m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z"
          />
        </svg>
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-14 h-14 stroke-[url(#gradient)]"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#2c3e50"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7 4v16l13 -8z" />
        </svg>
      {/if}
    </button>
    <button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 stroke-[url(#gradient)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 5v14l12 -7z" />
        <path d="M20 5l0 14" />
      </svg>
    </button>
    <ToggleFavorite {data} slug={clip.slug} />
  </div>
  <Tabbar class="left-0 bottom-0 fixed opacity-75 lg:hidden">
    <TabbarLink class="bg-[var(--navbar-color)]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 stroke-[var(--first-active-color)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M17 17v-13h4" />
        <path d="M13 5h-10" />
        <path d="M3 9l10 0" />
        <path d="M9 13h-6" />
      </svg>
    </TabbarLink>
    <TabbarLink class="bg-[var(--navbar-color)]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 stroke-[var(--first-active-color)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
        />
      </svg>
    </TabbarLink>
  </Tabbar>
</Page>

<Sidebar
  {panelOpened}
  on:close={() => {
    panelOpened = false
  }}
/>

<!-- <style>
  :global(.rangeSlider.hoverable) {
    background: rgba(255, 255, 255, 0.05);
    box-shadow: 0 15px 15px rgba(0, 0, 0, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    -webkit-backdrop-filter: blur(15px);
    backdrop-filter: blur(15px);
    height: 1em;
  }
  :global(.rangeSlider > .rangeHandle) {
    width: 2em !important;
    height: 2em !important;
  }
  :global(.rangeSlider > .rangeHandle.active > .rangeFloat) {
    background-image: linear-gradient(
      to right,
      var(--greengradient-from),
      var(--greengradient-to)
    );
  }
  :global(.rangeSlider > .rangeHandle > .rangeNub) {
    background-image: linear-gradient(
      to right,
      var(--greengradient-from),
      var(--greengradient-to)
    );
  }
  :global(.rangeSlider > .rangeHandle.active > .rangeNub) {
    background-image: linear-gradient(
      to right,
      var(--greengradient-from),
      var(--greengradient-to)
    ) !important;
  }
  :global(.rangeSlider > .rangePips > .pip) {
    color: white;
  }
  :global(.rangeSlider > .rangePips > .pip.selected) {
    color: var(--greengradient-from);
  }
  @media only screen and (max-width: 768px) {
    /* For mobile phones: */
    :global(.rangeSlider > .rangePips > .pip > .pipVal) {
      visibility: hidden !important;
    }
  }
  @media only screen and (min-width: 768px) {
    /* For mobile phones: */
    :global(.rangeSlider > .rangeHandle > .rangeFloat) {
      visibility: hidden !important;
    }
  }
</style> -->
