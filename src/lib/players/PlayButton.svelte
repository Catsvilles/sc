<script lang="ts">
  import { song, playing } from './../../stores/player';
  export let track;
  // export let widthHeight = 34;
  // export let fontSize = 13;

  $: isCurrent = track.id === $song.id ? true : false;

  const play = () => {
    $song = {...track, isCurrent: isCurrent};
    $playing = true;
  }

  const pause = () => {
    $song['pause'] = true;
    $playing = false;
  }
</script>
{#if isCurrent && $playing}
<div on:click="{pause}" class="cursor-pointer bg-gradient-to-r from-[#151820] to-[#2f374b]  shadow-lg text-neutral-300 p-2 rounded-full duration-300 ease-in-out transform hover:scale-105">
  <svg class="w-8 h-8 transform hover:scale-105" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/></svg>
</div>
{:else}
<div on:click="{play}" class="cursor-pointer bg-gradient-to-r from-[#151820] to-[#2f374b]  shadow-lg
text-neutral-300 p-1 rounded-full duration-300 ease-in-out transform hover:scale-105">
<svg class="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
  <polygon class="fill-current" points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69"/>
</svg>
</div>
{/if}

