<script lang="ts">
	import { onMount } from 'svelte';
	import { Player } from '@vime/svelte';
	import type vimePlayer from '@vime/svelte/dist/types/components/Player';
	import FileUpload from './FileUpload.svelte';
	import { hideModal }from "@app/stores/vimestore";
	import vimePlayerStore from "@app/stores/playpausevime";
	import SplitPane from "@components/layout/SplitPane.svelte";

	export let reloadPlayer: () => void;
	export let movePlayer: () => void;
	
	let movePlayerIconsToggle: boolean = false;
	let width = 500;

	type Video = {
		id: number;
		url: string;
		src: string;
		title: string;
		domain: string;
	};
    
	let ind = 0;
	let input: string = '';
	let videoUrl: string;
	let videos: Video[] = [];
	let playerHasMounted: boolean = false;
	let player: vimePlayer;
	let volume: string;
	let currentTime: number = 0;
    let muted: boolean = false;
	let hidePlayer: boolean = false;

	$: input, populateVideos();
	$: {
		player;
		vimePlayerStore.set(player);
	}
	
	onMount(async function () {
		const { defineCustomElements } = await import('@vime/core');
		defineCustomElements();
		playerHasMounted = true;
	});

	const populateVideos = async () => {
		if (input === '') return;
		let initial_index = videos.length;
		let urls = validateInput();
		videos.length += urls.length;
		for (let i = 0; i < urls.length; i++) {
			let video_ind = i + initial_index;
			let domain = urls[i].split('/')[2].replace('www.', '').split('.')[0];
			videos[video_ind] = {
				id: video_ind,
				url: urls[i],
				src: '',
				title: 'Loading Title...',
				domain
			};
		}
		fetchVideoSrc(initial_index, videos[initial_index].url, videos[initial_index].domain);
		input = '';
	};

	const validateInput = () => {
		let urls = input.split('\n');
		let urlRegex = /^http[s]?\:\/\/(\w*\.)?\w*\.\w*\/.*$/m;
		for (let i = 0; i < urls.length; i++) {
			urls[i] = urls[i].trim();
			const isProperUrl = urlRegex.test(urls[i]);
			if (!isProperUrl) {
				urls.splice(i, 1);
				i--;
			}
		}
		return urls;
	};

	const fetchVideoSrc = async (index: number, url: string, domain: string) => {
		hidePlayer = false;
		switch (domain) {
			case 'youtube': {
				let video_id = url.split('watch?v=')[1].split('&')[0];
				videos[index].src = video_id;
				break;
			}
			case 'vimeo': {
				let video_id = url.split('/')[3];
				videos[index].src = video_id;
				break;
			}
			case 'dailymotion': {
				let video_id = url.split('/')[4];
				videos[index].src = video_id;
				break;
			}
		}
	};
	const handleNewVideo = async (videoFile: File) => {
		hidePlayer = false;
		if (videoUrl) URL.revokeObjectURL(videoUrl);
		videoUrl = URL.createObjectURL(videoFile);
		fetchVideoSrc(0, videoUrl, '')
		const video : Video = {
			id: 0,
			url: videoUrl,
			src: videoUrl,
			title: "File Input",
			domain: "local file",
		};
		videos.push(video);
	};
</script>

<div class="{$hideModal === true ? "block" : "hidden"} relative flex flex-col">
	{#if playerHasMounted && videos[ind]?.domain}
		<div class:hidden={hidePlayer} class="absolute flex justify-between gap-2 bg-[#333333] opacity-75 top-2 right-2 z-30 rounded-md">
			<button on:pointerdown={ reloadPlayer } class="m-1">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="white" viewBox="0 0 24 24">
					<path d="M23 12c0 1.042-.154 2.045-.425 3h-2.101c.335-.94.526-1.947.526-3 0-4.962-4.037-9-9-9-1.706 0-3.296.484-4.655 1.314l1.858 2.686h-6.994l2.152-7 1.849 2.673c1.684-1.049 3.659-1.673 5.79-1.673 6.074 0 11 4.925 11 11zm-6.354 7.692c-1.357.826-2.944 1.308-4.646 1.308-4.962 0-9-4.038-9-9 0-1.053.191-2.06.525-3h-2.1c-.271.955-.425 1.958-.425 3 0 6.075 4.925 11 11 11 2.127 0 4.099-.621 5.78-1.667l1.853 2.667 2.152-6.989h-6.994l1.855 2.681z"/>
				</svg>
			</button>
			<div class="flex items-center justify-between gap-2">
				<button on:pointerdown={()=>{ $hideModal =!$hideModal }} class="cursor-pointer hover:animate-pulse">
					<svg class="w-4 h-4 -mb-2 mr-2" fill="white" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path d="m21 11.75c0-.414-.336-.75-.75-.75h-16.5c-.414 0-.75.336-.75.75s.336.75.75.75h16.5c.414 0 .75-.336.75-.75z" fill-rule="nonzero"/>
					</svg>
				</button>
				<button on:pointerdown={()=> {movePlayerIconsToggle= !movePlayerIconsToggle}} on:pointerdown={ movePlayer }>
					{#if movePlayerIconsToggle === false}
						<svg width="15" height="15" fill="white" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path d="m6 18h-3c-.48 0-1-.379-1-1v-14c0-.481.38-1 1-1h14c.621 0 1 .522 1 1v3h3c.621 0 1 .522 1 1v14c0 .621-.522 1-1 1h-14c-.48 0-1-.379-1-1zm1.5-10.5v13h13v-13zm9-1.5v-2.5h-13v13h2.5v-9.5c0-.481.38-1 1-1z" fill-rule="nonzero"/>
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="white" viewBox="0 0 24 24">
							<path d="M19 2c1.654 0 3 1.346 3 3v14c0 1.654-1.346 3-3 3h-14c-1.654 0-3-1.346-3-3v-14c0-1.654 1.346-3 3-3h14zm0-2h-14c-2.762 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5z"/>
						</svg>
					{/if}
				</button>
				<button on:pointerdown={()=>{$hideModal = !$hideModal; player.pause()}} class="flex items-center gap-2 uppercase p-1 rounded-sm text-white text-xs cursor-pointer hover:animate-pulse">
					<svg class="w-4 h-4" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
						<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
					</svg>
				</button>
			</div>
		</div>
	{/if}
	<SplitPane
		direction="row"
		min={400}
		snaps={[150, 200, 250]}
		bind:splitpos={width}
	>	
	{#if videos[ind]?.src}
		{#if playerHasMounted && videos[ind]?.domain}
			{#key ind}
				<Player
					class="w-full h-full"
					volume = {volume}
					muted = {muted} 
					currentTime = {currentTime}
					theme = "dark"
					controls
					bind:this={player}			
				>
					{#if videos[ind]?.domain === 'youtube'}
						<vm-youtube video-id={videos[ind]?.src} />
					{:else if videos[ind]?.domain === 'vimeo'}
						<vm-vimeo video-id={videos[ind]?.src} />
					{:else if videos[ind]?.domain === 'dailymotion'}
						<vm-dailymotion video-id={videos[ind]?.src} />
					{:else if videos[ind]?.domain === 'local file'}
						<vm-video>
							<source data-src={videoUrl} type="video/mp4" />
						</vm-video>
					{:else}
						<vm-video>
							<source data-src={videos[ind]?.src} type="video/mp4" />
						</vm-video> 
					{/if}
				</Player>
			{/key}
		{/if}
	{:else}
		<FileUpload onFile={handleNewVideo} bind:input/>
	{/if}
	</SplitPane>
</div>

