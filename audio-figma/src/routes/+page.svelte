<script lang="ts">
import type { PageData } from '../$types';
import { onMount } from 'svelte';
import { page } from '$app/stores';
import { get } from "./../util/api";
import CommentsSection from '$lib/CommentsSection.svelte';
import PlayerSkeleton from '$lib/players/PlayerSkeleton.svelte';
import Icon from "@components/Icon.svelte";
import PlaylistPlayer from '$lib/players/PlaylistPlayer.svelte';
import NoProduct from '$lib/mixer/NoProduct.svelte';
import { grow } from "@components/layout/Stack.svelte";
import SplitPane from "@components/layout/SplitPane.svelte";
import Projects from "$lib/Projects.svelte";
import * as webAudioPeakMeter from 'web-audio-peak-meter';

export let data: PageData;

let categories = [];
let query = [];
let tracks = [{
    id: 1,
    title:  'First Example',
    slug: 'fex',
    desc: 'desc',
    url: '/1.mp3',
    duration: 1,
    pcm: [],
    //img: td.img,
    category: 'category',
    tags: '',
    isCurrent: false,
    pause: false
  },{
    id: 2,
    title:  'Second Example',
    slug: 'fex',
    desc: 'desc',
    url: '/2.mp3',
    duration: 1,
    pcm: [],
    //img: td.img,
    category: 'category',
    tags: '',
    isCurrent: false,
    pause: false
  },
  {
    id: 3,
    title:  'Third Example',
    slug: 'fex',
    desc: 'desc',
    url: '/3.mp3',
    duration: 1,
    pcm: [],
    //img: td.img,
    category: 'category',
    tags: '',
    isCurrent: false,
    pause: false
  }];
categories = [];
let hasMore = true;
let pages = 1;
let newBatch: string[] = [];
let loading = false;
let EditorComponent;
let mounted	: boolean;
let activeLeftTab : string;
let activeRightTab : string;
let activeFacetsTab : string;
let searchQuery = '';
let menuWidth = 350;
let meterelement : HTMLElement;
let player;
const facets = {
	moods: categories.moods, 
	genres: categories.genres, 
	other: categories.other
};

onMount(async () => {
	const optionsTwoA = {
		vertical: true,
		backgroundColor: "#262626"
	};

	const foo = await import('./../editor/Editor.svelte');
	EditorComponent = foo.default;
	mounted = true;

	const playerComp = await import('@app/stores/player');
	player = playerComp.default;
	new webAudioPeakMeter.WebAudioPeakMeter($player.masterGain, meterelement, optionsTwoA);
});

async function loadMore() {
	console.log(tracks)
	try {
		loading = true;
		pages += 1;
		//NOTE +10 because first time we load 20 items, and then just add 10
		const offset = (pages - 1) * 10 + 10;
		//TODO adapt lazyloading for genre, tag, playlist etc
		newBatch = await get(`tracks?${query}&offset=${offset}&limit=10`);
	} catch (e) {
	} finally {
		loading = false;
	}
	if (newBatch.length == 0) {
		hasMore = false;
	}
		//hasMore = false;
};

$: tracks = [
...tracks,
...newBatch
];

let tabs = [
	// { id: 0,
	// title: 'home', 
	// icon: 'home/home_outline', 
	// },
	{ id: 1,
	title: 'library', 
	icon: 'edit/search', 
	},
	// { id: 2,
	// title: 'uploads',
	// icon: 'grid/grid_big',
	// },
	// { id: 3,
	// title: 'projects',
	// icon: 'file/folder',
	// }
];

let rightSideBarTabs = [
	// { id: 0,
	// title: 'comments',
	// icon: 'communication/chat',
	// },
	{ id: 1,
	title: 'peaks',
	icon: 'grid/grid_vertical',
	},
];

let facetsTabs = [
	{ id: 0,
	category: 'moods', 
	title: 'Mood', 
	},
	{ id: 1,
	category: 'genres', 
	title: 'Genre',
	},
	{ id: 2,
	category: 'other', 
	title: 'Other',
	}	
];

async function search(event: KeyboardEvent) {
	const allTracks = await get(`tracks?limit=100`);
	const filteredData = allTracks.filter(item => {
		return item.data.title.toLowerCase().includes(searchQuery.toLowerCase());
	});
	if(filteredData.length > 0) {
		tracks = filteredData;
	} else {
		tracks = allTracks;
	}
};

async function sort(cat: string, type: string) {			
	const allTracks = await get(`tracks?limit=100`);	
	const filteredData = allTracks.filter(val => val.data.category[type].slug === cat.slug);	
	if(filteredData.length > 0) {
		tracks = filteredData;
	} else {
		tracks = allTracks;
	}
};

function keydown(event: KeyboardEvent) {
	event.stopImmediatePropagation(); 
	event.stopPropagation(); 
}

let AiModal;
let hideAiModal = false;
$: if (hideAiModal) {
	AiModal = null;
}
function showAiModal() {
	hideAiModal = false;
    import('$lib/modals/AiModal.svelte').then(res => AiModal = res.default);
}
</script>
<svelte:component this={AiModal} bind:hideAiModal />
<div class="flex flex-row items-center lg:ml-14 lg:mr-14 mb-14 lg:mb-0 bg-[#262626]">
	<!-- sidebar -->
	<div class="fixed flex flex-row lg:flex-col justify-center items-center px-2 lg:top-0 lg:left-0 bottom-0 left-0 lg:h-screen lg:w-min w-full lg:z-20 z-50 bg-[#333333]">
		<div class="flex flex-row lg:flex-col gap-4 bg-[#262626] rounded-md lg:py-4 px-4 lg:px-0">
			{#each tabs as tab}
				<button on:click={() => tab.title === activeLeftTab ? activeLeftTab = "" : activeLeftTab = tab.title} class:active={tab.title === activeLeftTab} class="{tab.title === activeLeftTab ? "bg-[#333333] " : ""}text-white p-2">
					<span class="flex justify-center items-center">
						{#if mounted}
							<Icon
							name={tab.icon}
							size="1.5em"
							color="gray"
							/>
						{/if}
					</span>
				</button>
			{/each}   
		</div>
	</div>
	{#if activeLeftTab}
		<div>
			<SplitPane direction="row" min={300} snaps={[150, 200, 250]} bind:splitpos={menuWidth}>
				<div class="fixed top-[64px] lg:static z-20 flex flex-col items-center lg:ml-1 bg-[#333333]" use:grow>
					<div class="overflow-y-scroll w-screen h-screen lg:w-[98%] pb-24 lg:pb-0">
						{#if activeLeftTab === 'library'}
							<div class="flex flex-col gap-2 bg-[#333333] p-4 rounded-md">
								<!-- <div on:pointerdown={()=>{activeLeftTab = ""}} class="flex items-center justify-end w-full cursor-pointer mt-4">
									{#if mounted}
									<Icon
										name="edit/off_outline_close"
										size="1.5em"
										color="gray"
									/>
									{/if}
								</div> -->
								<!-- Search -->
								<!-- <div class="flex flex-col gap-4 items-center justify-center w-full mb-2">
									<div class="flex items-center justify-start w-full gap-4 px-2 py-2 rounded-md bg-[#262626]">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 cursor-pointer" on:pointerdown={search} fill="none" viewBox="0 0 24 24" stroke="gray">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
										</svg>
										<input type="text" bind:value={searchQuery} on:keydown={keydown} on:input={search} class="bg-[#262626] text-sm focus:outline-none text-[gray] w-min" placeholder="Search"/>
									</div>
								</div> -->
								<!-- tabs -->
								<div class="flex flex-col gap-2">
									<!-- <div class="flex gap-2">
										{#each facetsTabs as tab}
											<button on:pointerdown={() => tab.title === activeFacetsTab ? activeFacetsTab = "" : activeFacetsTab = tab.title} class="flex items-center justify-center gap-1 bg-[#262626] rounded-full w-min px-2 border border-orange-500">
												<span class="text-xs text-white">{tab.title}</span>
												{#if tab.title === activeFacetsTab}
													<svg clip-rule="evenodd" class="w-4 h-4" fill="gray" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
														<path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z"/>
													</svg>
												{:else}
													<svg clip-rule="evenodd" fill="gray" class="w-4 h-4" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
														<path d="m16.843 13.789c.108.141.157.3.157.456 0 .389-.306.755-.749.755h-8.501c-.445 0-.75-.367-.75-.755 0-.157.05-.316.159-.457 1.203-1.554 3.252-4.199 4.258-5.498.142-.184.36-.29.592-.29.23 0 .449.107.591.291 1.002 1.299 3.044 3.945 4.243 5.498z"/>
													</svg>
												{/if}
											</button>
										{/each}
										<button class="flex items-center justify-center content-center gap-1 bg-orange-500 rounded-full px-3 text-xs">
											Clear
										</button>
									</div> -->
									{#each facetsTabs as tab}
										<div class="flex flex-col">
											{#if tab.title === activeFacetsTab}
												{#each facets[tab.category] as item}
													<div class="flex gap-4 text-white">
														<input type="checkbox" bind:value={item.slug} on:change={(event) => {
															if (event.target.checked) {
																sort(item, tab.title);
															}
														}}>
														<span class="font text-sm">{item.slug}</span>
													</div>
												{/each}
											{/if}
										</div>
									{/each}
								</div>
								{#if tracks.length > 0}
									{#each tracks as t}
										<PlaylistPlayer track={t}/>
									{/each}
								{:else}
									<NoProduct />
								{/if}
								{#if loading}
									{#each { length: 10 } as _, i}
										<PlayerSkeleton />
									{/each}
								{/if}
							</div>	
						{:else if activeLeftTab === 'uploads'}
							<p class="text-white text-center">Coming soon.</p>
						{:else if activeLeftTab === 'projects'}
						   {#if $page.data.session}
								<div on:pointerdown={()=>{activeLeftTab = ""}} class="flex items-center justify-end w-full cursor-pointer p-4 mt-4">
									{#if mounted}
									<Icon
										name="edit/off_outline_close"
										size="1.5em"
										color="gray"
									/>
									{/if}
								</div>
						   		<Projects supabaseClient={data.supabase} user_id={data.session.user.id} />
						   	{:else}								
								<div class="w-full flex items-center justify-center p-4 bg-[#333333] mx-1 my-2">
									<div class="flex flex-row justify-center items-center gap-2">
										<svg xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6">
											<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
										</svg>
										<span class="text-white text-sm">Please, SIGN IN to create a projects.</span> 
									</div>
								</div>
						   	{/if} 
						{/if}
					</div>
				</div>
			</SplitPane>
		</div>
	{/if}	
	<!-- <div class="w-full">
		{#if !$page.data.user}
			<div class="w-full flex items-center justify-center p-4 bg-[#333333] mx-1 my-2">
				<div class="flex flex-row justify-center items-center gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6">
						<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
					  </svg>
					<span class="text-white text-sm">Please, SIGN IN to save your progress.</span> 
				</div>
			</div>
		{/if} -->
	<!-- </div> -->
	<div class="w-full h-screen mt-8 lg:mt-0">
		<svelte:component this="{EditorComponent}" />
	</div>
	<div class="{activeRightTab  === "peaks" ? "block" : "hidden"} flex z-20">
		<div bind:this={meterelement} style="width: 5em; height: 100vh; margin: 1em 0;"></div>
	</div>
	
	{#if activeRightTab == 'comments'}
		<div>
			<SplitPane  reverse={false} direction="row" min={300} snaps={[150, 200, 250]} bind:splitpos={menuWidth}>
					{#if $page.data.session}
						<CommentsSection on:close={()=>{activeRightTab = ""}} supabaseClient={data.supabase} user_id={data.session.user.id} user_name={$page.data.session.user.user_metadata.user}/>
					{:else}
						<div class="w-full flex items-center justify-center p-4 bg-[#333333] mx-1 my-2">
							<div class="flex flex-row justify-center items-center gap-2">
								<svg xmlns="http://www.w3.org/2000/svg" fill="gray" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-6 h-6">
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
								</svg>
								<span class="text-white text-sm">Please, SIGN IN to write a comment.</span> 
							</div>
						</div>
					{/if}
			</SplitPane>
		</div>
	{/if}	
	<div class="fixed flex flex-row lg:flex-col justify-center items-center px-2 lg:top-0 lg:right-0 top-14 right-0 lg:h-screen lg:w-min w-full z-20 lg:z-0 bg-[#333333]">
		<div class="flex flex-row lg:flex-col gap-4 bg-[#262626] rounded-md lg:py-4 px-4 lg:px-0">			
			<!-- <button on:pointerdown={showAiModal}
				class="{$hideModal === true ? "bg-[#333333]" : ""} flex justify-center items-center p-2"
				>
				<Icon
				name={"edit/edit"}
				size="1.5em"
				color="gray"
				/>
			</button> -->
			{#each rightSideBarTabs as tab}
				<button on:click={() => {tab.title === activeRightTab ? activeRightTab = "" : activeRightTab = tab.title;}} 
					class:active={tab.title === activeRightTab} 
					class="{tab.title === activeRightTab ? "bg-[#333333] " : ""}text-white p-2">
					<span class="flex justify-center items-center">
						{#if mounted}
							<Icon
							name={tab.icon}
							size="1.5em"
							color="gray"
							/>
						{/if}
					</span>
				</button>
			{/each}
			<!-- <button on:pointerdown={()=>{$hideModal=!$hideModal}}
				class="{$hideModal === true ? "bg-[#333333]" : ""} flex justify-center items-center p-2"
				>
				<Icon
				name={"device/monitor"}
				size="1.5em"
				color="gray"
				/>
			</button> -->
		</div>
	</div>
</div>

















  























