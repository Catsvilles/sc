<script lang="ts">
  import Waveform from './Waveform.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { format } from '../../helpers';
  import { Howl, Howler } from 'howler';
  import { playlist, song, playing, currentTime } from '../../stores/player';
  import CartButton from '$lib/ui/CartButton.svelte';

  let duration =  0;
  let time = 0;
  // let $playing = false;
  let isLiveStream = false;
  let volume = .5;
  let isPlaylistVisible = true;
  let currentSound = undefined;
  let showVolumeBar = false;
  let unsubscribe = () => {};
  let unscribeSong = () => {};
  let hidePlayer : boolean = false;

  $: percent = (time / duration).toFixed(2) || 0;

  onMount(() => {
    //currentSound =  createCurrentSong();

    if (localStorage.getItem('soundgrapePlaylist')) {
      playlist.set(JSON.parse(localStorage.getItem('soundgrapePlaylist')));
    }

    unscribeSong = song.subscribe((song) => {
      if (currentSound && !song.pause && !song.seekTo && !song.isCurrent) {
        currentSound.unload();
      }

      if (!song.pause && !song.seekTo && !song.isCurrent) {
        currentSound = createCurrentSong();
      }

      if (!$playing && song.url) {
        toggleSound();
      }

      if ($playing && song.pause) {
        pauseSound();
        $playing = false;
      }

      if ($playing && song.seekTo) {
        currentSound.seek(song.seekTo);
      }
    });
    //Howler.volume(volume);
    //loadNewSong();
    //currentSound = createCurrentSong();
  });

  onDestroy(() => {
    unsubscribe();
    unscribeSong();
  });

  const createCurrentSong = () => {
    const playing1 = $playing;
    hidePlayer = false;
    return new Howl({
      src: [$song.url],
      // xhrWithCredentials: true,
      preload: true,
      html5: true,
      // pool: 0,
      onplay: function() {             
        // Start upating the progress of the track.
        requestAnimationFrame(step.bind(this));  
      },
      onseek: function () {
        requestAnimationFrame(step.bind(this));
      },
      onload: () => {
        duration = currentSound.duration();
        time = $song.time;

        if(time) {
          currentSound.seek(time);
        }

        if (playing1) {
          playSound();
        }
      },
      onend: () => {
        $song = {};
        if ($playlist.length) {
          //loadNewSong();
        } else {
          resetSongStatus();
        }
      }
    });
  };

  const resetSongStatus = () => {
    $song = {};
    currentSound = null;
    duration =  0;
    time = 0;
    $playing = false;
  };

  const loadNewSong = () => {
    if (Object.keys($song).length || !$playlist.length) {
      return;
    }

    nextFromPlaylist();
  };

  const nextSong = () => {
    currentSound.unload();

    if (!$playlist.length) {
      resetSongStatus();
      return;
    }

    nextFromPlaylist();
  };

  const nextFromPlaylist = () => {
    $song = $playlist.shift();
    $playlist = $playlist; //TODO: nicer solution
    currentSound = createCurrentSong();
  };
  const toggleSound = () => $playing ? pauseSound() : playSound();

  const playSound = () => {
    currentSound.play();
    $playing = true;

      if (!$playing) {
        time = 0;
        return;
      }
  };

    // The step called within requestAnimationFrame to update the playback position.
  const step = () => {
    let self = this;
    time = currentSound.seek();
    $currentTime = time;
    if ($playing) {
        requestAnimationFrame(step.bind(self)); 
    }
  }

  const pauseSound = () => {
    currentSound.pause();
    $playing = false;
  };

  const fastForward = () => currentSound.seek(currentSound.seek() + 30);
  const backward = () => {
    const currentPosition = currentSound.seek();
    const newPostition = currentPosition - 10 > 0 ? currentPosition - 10 : 0;
    currentSound.seek(newPostition);
  };

  const setVolume = event => {
    if (event.type === 'mousemove' && event.buttons !== 1) {
      return;
    }

    const target = event.target.getBoundingClientRect();
    const position =  target.bottom - event.clientY;
    volume  = position / target.height;
    Howler.volume(volume);
  };

  const seekWithBar = event => {
    if (event.type === 'mousemove' && event.buttons !== 1) {
      return;
    }

    const target = event.target.getBoundingClientRect();
    const position = event.pageX - target.left;

    const rate  = position / target.width;
    currentSound.seek(rate * duration);

    if (!$playing) {
      toggleSound();
    }
  };

  const setCurrentData = () => {
    if (!Object.keys($song).length) {
      localStorage.removeItem('tilosStoreSong');
      return;
    }

    const fullSong = Object.assign({}, $song, { time });
    localStorage.setItem('tilosStoreSong', JSON.stringify(fullSong));
  };

  const togglePlaylist = () => isPlaylistVisible = !isPlaylistVisible;

  const togglePlaylistOutside = () => {
    if (isPlaylistVisible) {
      isPlaylistVisible = false;
    }
  };
  let mhover = 0;
  function progressHover(e) {
    mhover = e.offsetX;
  }
</script>
<div class:hidden={$song.url === undefined || hidePlayer} class="flex items-center rounded-md bg-[#333333] p-1 mb-1 text-xs">
  <div class="flex flex-col items-center justify-center gap-2">
    <div><p class="text-xs text-gray-400">Preview</p></div>
    {#if $playing}
      <div on:pointerdown={toggleSound} class="cursor-pointer bg-[#333333] border-2 border-[gray] rounded-full p-2 duration-300 ease-in-out transform hover:scale-105">
        <svg class="w-6 h-6 transform hover:scale-105" fill="#f97316" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5 4h3v12H5V4zm7 0h3v12h-3V4z"/>
        </svg>
      </div>
    {:else}
      <div on:pointerdown={toggleSound} class="cursor-pointer bg-[#333333] border-2 border-[gray] rounded-full p-0.5 duration-300 ease-in-out transform hover:scale-105">
        <svg class="w-9 h-9" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26">
          <polygon fill="#f97316" points="9.33 6.69 9.33 19.39 19.3 13.04 9.33 6.69"/>
        </svg>
      </div>
    {/if}
    <div class="mx-4 w-40 truncate">
      <div><a href="/track/{$song.slug}">{ $song.url ? $song.title : 'No sound selected' }</a></div>
    </div>
  </div>
  <div class="flex items-center relative bg-[#262626] w-full lg:z-20 p-1 text-white text-xs">
      <div class="bg-gray-800 bg-opacity-75 bg-opacity-4 p-1 leading-none z-10 text-gray-200 absolute bottom-auto" style="left: {(percent * 100)}%;">{format($currentTime)}</div>
      <Waveform on:click={seekWithBar} on:mousemove={seekWithBar} peaks={$song.pcm} percent={percent}  color="#494949" progressColor="#2390a9" height={80}></Waveform>
      <div class="bg-gray-800 bg-opacity-75 bg-opacity-4 p-1 leading-none ml-3 z-10 text-gray-200 absolute right-0 top-0">{format($song.duration)}</div>
  </div>
  <!-- <div on:pointerdown="{() => hidePlayer = !hidePlayer}" class="visible right-1 cursor-pointer bg-gradient-to-r from-[#181818] to-[#282828] 
    text-neutral-300 p-1 rounded-t-lg duration-300 ease-in-out transform">
    {#if hidePlayer}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    {:else }
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    {/if}
  </div> -->
</div>