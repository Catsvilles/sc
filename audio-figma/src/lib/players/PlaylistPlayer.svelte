<script lang="ts">
import Waveform from '$lib/players/Waveform.svelte';
import CartButton from '$lib/ui/CartButton.svelte';
import { format } from './../../helpers';
import Icon from "@components/Icon.svelte";
import { playlist, song, currentTime, playing } from './../../stores/player';
import { onMount } from 'svelte';

export let track;
export let waveHeight = 30;
export let waveColor = 'rgb(157, 23, 77, 0.6)';

// if (track.slug === undefined) {
//   track = mapTrackData(track);
// }

$: percent = ($currentTime / track.duration).toFixed(2) || 0;
$: isCurrent = track.id === $song.id ? true : false;
$: isInPlaylist = !!$playlist.find(p => p.id === track.id);

let mhover = 0;
function progressHover(event) {
  mhover = event.offsetX;
}

const togglePlaylist = () => {
  if (isInPlaylist) {
    return;
  }
  $playlist = [ ...$playlist, track];
}

export const playNow = () => {
  $song = {...track, isCurrent: isCurrent};
  togglePlaylist();
}

const pause = () => {
  $song.pause = true;
  $playing = false;
}

const seekWithBar = event => {
  const position = event.offsetX;
  const rate = position / event.target.offsetWidth;
  if ($song.id !== track.id || !$playing) {
    $song = {...track, isCurrent: isCurrent};
    $song['seekTo'] = rate * track.duration;
    $playing = true;
  } else {
    $song['seekTo'] = rate * track.duration;
  }
  togglePlaylist();
};
let categoryTitle;
for (const val of Object.entries(track.category)) { // You can use `let` instead of `const` if you like
  categoryTitle = val[1].title;
}

function handleDragStart(e: DragEvent) {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("text", JSON.stringify(track));
}

let AddToEditorBtn;
onMount(async () => {
    const res = await import('$lib/ui/EditorButton.svelte');
    AddToEditorBtn = res.default;
	});
//track.category.forEach(element => console.log(element));
</script>
<div draggable="true" on:dragstart={handleDragStart} class="flex items-center gap-2 px-2 py-2 bg-[#262626] rounded-md mb-1 w-full">
    {#if isCurrent && $playing}
    <div on:pointerdown="{pause}" class="cursor-pointer bg-orange-500 shadow-lg text-neutral-300 p-1.5 rounded-full duration-300 ease-in-out transform hover:scale-105">
      <svg class="w-4 h-4 transform hover:scale-105" fill="#262626" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/>
      </svg>
    </div>
  {:else}
    <div on:pointerdown="{playNow}" class="cursor-pointer bg-orange-500 shadow-lg text-neutral-300 rounded-full p-0.5 duration-300 ease-in-out transform hover:scale-105">
      <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
        <polygon fill="#262626" points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69"/>
      </svg>
    </div>
  {/if}
  <!-- {#if isCurrent && $playing}
    <div on:pointerdown={pause} class="bg-gray-900 text-white p-1.5 rounded-full shadow-xl border-transparent hover:border-gray-500 transform transition hover:scale-110 duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 opacity-70">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
  {:else}
    <div on:pointerdown={playNow} class="bg-gray-900 text-white p-1.5 rounded-full shadow-xl border-transparent hover:border-gray-500 transform transition hover:scale-110 duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 opacity-70">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
      </svg>      
    </div>
  {/if} -->
  <div class="w-full truncate text-neutral-300 text-xs">
    <p>{track.title}</p>
    <a href="/" class="text-xs">Mood/Genre</a>
  </div>
  <div class="flex gap-2">
    <div title="Add to Cart" class="flex items-center justify-center cursor-pointer p-1 rounded-full transform transition hover:scale-110 duration-300">
      <svg class="h-5 w-5" fill="gray" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none"><path d="M6.01 16.136L4.141 4H3a1 1 0 0 1 0-2h1.985a.993.993 0 0 1 .66.235a.997.997 0 0 1 .346.627L6.319 5H14v2H6.627l1.23 8h9.399l1.5-5h2.088l-1.886 6.287A1 1 0 0 1 18 17H7.016a.993.993 0 0 1-.675-.248a.999.999 0 0 1-.332-.616zM10 20a2 2 0 1 1-4 0a2 2 0 0 1 4 0zm9 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0zm0-18a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0V6h-1a1 1 0 1 1 0-2h1V3a1 1 0 0 1 1-1z" fill="gray"/></g></svg>
    </div>
    <svelte:component this="{AddToEditorBtn}" item={track} />
  </div>
</div>
