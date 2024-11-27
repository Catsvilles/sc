<script lang="ts">
    import { onMount } from 'svelte';
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
        Card
    } from 'konsta/svelte';
    import { player } from '$lib/audioPlayer';
    import { cachedFavorites } from '$lib/persistentStore';

    let isFavorite = false;
    let isPlaying = false;
    let volume = 0;
    let rangeColor = {
        thumbBgMaterial: "range-thumb:bg-[var(--first-active-color)]",
        valueBgMaterial: "bg-[var(--first-active-color)]"
    };

    onMount(async () => {
        if($player){
            if($cachedFavorites[$player.clip.id]){
                isFavorite = true;
            } else {
                isFavorite = false;
            }
        }
    });

    function togglePlayback() {
        isPlaying = !isPlaying;
        $player.togglePlayback();
    };

    function toggleFavorites(clip: Clip) {   
    
        const mappedClip = {
            id: clip.id,
            title: clip.title,            
        }

        if(!isFavorite) {
            isFavorite = true;
            cachedFavorites.update(favorites => {
                return { ...favorites, [clip.id]: mappedClip };
            });
        } else {
            isFavorite = false;
            cachedFavorites.update(favorites => {
                delete favorites[clip.id];
                return favorites;
            });
        }
    };
</script>
{#if $player}
{isFavorite}
    <div class="fixed bottom-14 lg:bottom-0 z-50 flex flex-row items-center justify-between gap-6 px-4 bg-[var(--navbar-color)] w-full h-16 opacity-75 border-b-2 border-[var(--background-color)]">
        <div class="flex flex-row items-center justify-start gap-4 lg:w-1/3">
            <a href={`/stream/${$player.clip.id}`} class="relative flex items-center justify-center w-14 h-14 rounded-full bg-cover bg-center opacity-75 cursor-pointer" style="background-image: url('{$player.clip.thumbnail}')"></a>
            <span>{$player.clip.title}</span>
        </div>
        <div class="flex flex-row items-center justify-center gap-6 lg:w-1/3">
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-[url(#gradient)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="var(--gradient-from)" />
                        <stop offset="100%" stop-color="var(--gradient-to)" />
                    </linearGradient>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M19.496 4.136l-12 7a1 1 0 0 0 0 1.728l12 7a1 1 0 0 0 1.504 -.864v-14a1 1 0 0 0 -1.504 -.864z" stroke-width="0" fill="currentColor" />
                    <path d="M4 4a1 1 0 0 1 .993 .883l.007 .117v14a1 1 0 0 1 -1.993 .117l-.007 -.117v-14a1 1 0 0 1 1 -1z" stroke-width="0" fill="currentColor" />
                </svg>
            </button>
            <button on:click={togglePlayback} >
                {#if isPlaying}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 stroke-[url(#gradient)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#00bc9b" />
                            <stop offset="100%" stop-color="#5eaefd" />
                        </linearGradient>
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" stroke-width="0" fill="currentColor" />
                        <path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" stroke-width="0" fill="currentColor" />
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 hover:stroke-[url(#gradient)] stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" stroke-width="0" fill="currentColor" />
                    </svg>
                {/if}
            </button>
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 hover:stroke-[url(#gradient)] stroke-[var(--first-active-color)]"  viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 5v14a1 1 0 0 0 1.504 .864l12 -7a1 1 0 0 0 0 -1.728l-12 -7a1 1 0 0 0 -1.504 .864z" stroke-width="0" fill="currentColor" />
                    <path d="M20 4a1 1 0 0 1 .993 .883l.007 .117v14a1 1 0 0 1 -1.993 .117l-.007 -.117v-14a1 1 0 0 1 1 -1z" stroke-width="0" fill="currentColor" />
                </svg>
            </button>
            <button on:pointerdown={()=>{toggleFavorites($player.clip)}}>
                {#if isFavorite }
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-[url(#gradient)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" stroke-width="0" fill="currentColor" />
                    </svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-[url(#gradient)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                {/if}
            </button>
        </div>
        <div class="lg:block hidden lg:w-1/3">
            <div class="flex items-center justify-center w-full gap-4">
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 hover:stroke-[url(#gradient)] stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M15 8a5 5 0 0 1 0 8" />
                        <path d="M17.7 5a9 9 0 0 1 0 14" />
                        <path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
                    </svg>
                </button>
                <Range 
                    style="width: 120px"
                    value={volume}
                    step={1}
                    max={100}
                    min={0}
                    colors={rangeColor}
                    onInput={(e) => (volume = e.target.value)}
                />
            </div>
        </div>
    </div>
{/if}

