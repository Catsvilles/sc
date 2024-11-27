<script lang="ts">
    import { onMount } from 'svelte';
    import { 
        Navbar,  
        Tabbar,
        TabbarLink, 
        Link, 
        Panel,
        Page,
    } from 'konsta/svelte';
    import Menu from '$lib/components/Menu.svelte';
    import { cachedFavorites } from '$lib/persistentStore';
    import { supabase } from "$lib/supabase";

    let favorites: Clip[] = [];

    let card: HTMLDivElement;
    let cardheight: number;
    let leftPanelOpened = false;

    let favoritesHeader = {
        title: 'Your Favorites',
        description: '',
        thumbnail: 'https://i.ibb.co/sFcsWvc/Eerie-Forest.jpg'
    };

    onMount(async () => {
        await promiseFavorites();
		updateCardWidth();
        window.addEventListener('resize', updateCardWidth);    
    });

    async function promiseFavorites(){
        const trackIds = Object.values($cachedFavorites).map(track => track.id);
        await Promise.all(trackIds.map(id => fetchFavorites(id))); 
    };

    async function fetchFavorites(id: string) {
        let { data, error} = await supabase
        .from("playlist")
        .select("*")
        .eq('id', id)
        if (error) {
            console.log("error", error);
        } else {
            favorites.push(data[0]);
        }   
    };

    function updateCardWidth() {
        if (card) {
            cardheight = card.offsetWidth;
        }
    };

    function removeFromFavorites(id: string){
        cachedFavorites.update(cachedClip => {
            delete cachedClip[id];
            return cachedClip;
        });
        favorites = favorites.filter(clip => clip.id !== id);
    };

    let backgroundColor = {
        bgMaterial: "bg-[var(--background-color)]",
    };
</script>

<Page colors={backgroundColor} class="flex">
    <div class="hidden lg:block w-3/12 sticky top-0 border-r-2 border-[var(--navbar-color)]">
        <div class="flex flex-row items-center justify-center gap-2 py-4">
            <div class="w-14 h-14 rounded-full bg-cover bg-center" style="background-image: url('/logo.jpeg');"></div>
            <h1 class="uppercase text-sm font-extrabold">atmoscapia</h1>
        </div>
        <Menu/>
    </div>
    <div class="lg:w-9/12 w-full">
        <div class="relative flex items-center justify-center w-full z-10">
            <div bind:this={card} class="flex flex-col items-center justify-center gap-4 w-full bg-cover bg-center opacity-75" style="height: {cardheight}px; background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), var(--background-color)), url('{favoritesHeader.thumbnail}')">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 stroke-[url(#gradient)]" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="var(--gradient-from)" />
                        <stop offset="100%" stop-color="var(--gradient-to)" />
                    </linearGradient>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 4v16l13 -8z" />
                </svg>
                <span class="tex-center text-lg font-semibold select-none">{favoritesHeader.title}</span>
                <span class="tex-center select-none">{favoritesHeader.description}</span>
            </div>
            <button class="lg:hidden absolute top-4 right-4" on:pointerdown={()=>{leftPanelOpened = !leftPanelOpened}}>
                <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 stroke-[url(#gradient)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="var(--gradient-from)" />
                        <stop offset="100%" stop-color="var(--gradient-to)" />
                    </linearGradient>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                </svg>
            </button>
        </div>
        <div class="relative grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 p-2 gap-2 pb-20 z-10">
            {#if favorites.length === 0}
                <div bind:this={card} class="w-full" style="height: {cardheight}px;"></div>
                <div class="absolute flex items-center justify-center w-full h-full">
                    <span>No favorites added yet</span>
                </div>
            {/if}
            {#each favorites as clip}
                <div bind:this={card} class="relative flex items-center justify-center w-full rounded-md bg-cover bg-center opacity-75 cursor-pointer" style="height: {cardheight}px; background-image: url('{clip.thumbnail}')">
                    <a href={`/stream/${clip.id}`}>
                        {clip.title}
                    </a>
                    <button class="absolute top-4 left-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 stroke-[url(#gradient)]" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="var(--gradient-from)" />
                                <stop offset="100%" stop-color="var(--gradient-to)" />
                            </linearGradient>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M7 4v16l13 -8z" />
                        </svg>
                    </button>
                    <button on:pointerdown={()=>{removeFromFavorites(clip.id)}} class="absolute bottom-4 right-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 stroke-[url(#gradient)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" stroke-width="0" fill="currentColor" />
                        </svg>
                    </button>
                </div>
            {/each}
        </div>
    </div>
    <Tabbar class="left-0 bottom-0 fixed opacity-75 lg:hidden">
        <TabbarLink class="bg-[var(--navbar-color)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M17 17v-13h4" />
                <path d="M13 5h-10" />
                <path d="M3 9l10 0" />
                <path d="M9 13h-6" />
            </svg>
        </TabbarLink>
        <TabbarLink class="bg-[var(--navbar-color)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
        </TabbarLink>
    </Tabbar>
</Page>
<Panel side="left" opened={leftPanelOpened} onBackdropClick={() => (leftPanelOpened = false)}>
    <Page>
      <Navbar>
        <Link slot="left" navbar>
            <div class="flex flex-row items-center justify-center gap-2 py-4">
                <div class="w-10 h-10 rounded-full bg-cover bg-center" style="background-image: url('/logo.jpeg');">
        
                </div>
                <h1 class="uppercase text-sm font-extrabold">atmoscapia</h1>
            </div>
        </Link>
        <Link slot="right" navbar onClick={() => (leftPanelOpened = false)}>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
            </svg>
        </Link>
      </Navbar>
      <Menu/>
    </Page>
</Panel>