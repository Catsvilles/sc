<script lang="ts">
	import { playlist, song, currentTime, playing } from './../../stores/player';
	import Waveform from '$lib/players/Waveform.svelte';
	export let waveHeight = 60;
    export let waveColor = 'rgb(157, 23, 77, 0.6)';
	export let track;

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
</script>

<h1 class="text-3xl uppercase text-center text-white font-bold mt-24 p-20 ">{track.title}</h1>
<div class="flex justify-center items-center w-full absolute  mx-auto mt-60">
	{#if isCurrent && $playing}
	<div on:click="{pause}" class="cursor-pointer bg-gradient-to-r from-[#181818] to-[#282828] text-neutral-300 p-2 rounded-full duration-300 ease-in-out transform hover:scale-105">
		<svg class="w-8 h-8 transform hover:scale-105" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/></svg>
	</div>
	{:else}
	<div on:click="{playNow}" class="cursor-pointer bg-gradient-to-r from-[#181818] to-[#282828] 
	  text-neutral-300 p-1 rounded-full duration-300 ease-in-out transform hover:scale-105">
		<svg class="w-10 h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
			<polygon class="fill-current" points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69"/>
		</svg>
	</div>
	{/if}
</div>
<div class="w-11/12 mx-auto mt-4">
	<Waveform on:click={seekWithBar} peaks={track.pcm} percent={isCurrent ? percent : 0} barWidth={0.9} color="#163db0" progressColor="#5d80ea" height={waveHeight}></Waveform>
</div>