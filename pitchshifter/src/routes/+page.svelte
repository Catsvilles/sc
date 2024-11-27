<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer from 'wavesurfer.js';
	import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
	import { Player } from '$lib/player/player';
	import { presets } from '$lib/presets';

	interface RegionTimePoints {
		start: undefined | number;
		end: undefined | number;
	};

	let wavesurfer: WaveSurfer;
	let regions = RegionsPlugin.create();
	let player = new Player();

	// URL or RequestInfo object representing the source of the audio track
	let url: string;

	// Duration of the loaded audio track in seconds
	let trackDuration: number = 0;

	// Boolean flag to indicate whether the cutting mode (region selection) is active
	let cuttingMode = false;

	// Boolean flag to control the play/pause state of the audio playback
	let playPauseToggle = false;

	// Boolean flag indicating if the audio is currently playing
	let isPlaying = false;

	// Reactive variable to track the progress of audio playback as a percentage
	$: progress = 0;

	// Reactive variable to track the progress of audio playback in seconds
	// Can be assigned separately or we can just use 
	$: animatedTime = "00:00";

	// Array of peak values representing the waveform data
	$: peaks = [0];

	// Object representing the initial start and end times of a region
	let initialRegion: RegionTimePoints = {
		start: undefined,
		end: undefined,
	};

	// Object representing the current start and end times of the active region
	let currentRegion: RegionTimePoints = {
		start: undefined,
		end: undefined,
	};

	// Object representing the previous start and end times of a region
	let previousRegion: RegionTimePoints = {
		start: undefined,
		end: undefined,
	};

	async function fileInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = (target.files as FileList)[0];
		url = URL.createObjectURL(file);
		const audioContext = new (window.AudioContext || window.webkitAudioContext)();
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		trackDuration = audioBuffer.duration;
		//Initializes the audio player
		player.initializeAudioContext(url);
		//Reset the previous audio region
		setPreviousRegion(false);
		currentRegion.start = 0;
		currentRegion.end = trackDuration;
	};

	function initWavesurfer(url: string, peaks: number[]){		
		// Destroy the existing WaveSurfer instance if it exists
		if(wavesurfer){
			wavesurfer.destroy();
			cuttingMode = false;
			playPauseToggle = false;
			currentRegion.start = 0;
			currentRegion.end = trackDuration;
		};
		// Create a new WaveSurfer instance with the specified options
		wavesurfer = WaveSurfer.create({
			container: '#waveform',
			waveColor: '#464646',
			progressColor: '#d44040',
			cursorColor: 'red',
			barWidth: 2,
			barRadius: 2,
			barGap: 2,
			height: 100,
			url: url,
			peaks: [peaks],
			plugins: [regions],
		});
		// Event handler for when a new region is created
		regions.on('region-created', (region) => {		
			currentRegion.start = region.start;
			currentRegion.end = region.end;
			wavesurfer.setTime(currentRegion.start);
			if (presets.fadein.value > 0 || presets.fadeout.value > 0) {
				player.finalizeFades(progress, true, currentRegion.start, currentRegion.end);
				rerenderPeaks();
				progress = currentRegion.start / trackDuration * 100
				if(isPlaying){
					play();
				};
			};
			if(player.soundtouch){
				player.soundtouch.percentagePlayed = currentRegion.start / wavesurfer.getDuration();
			};
			setPreviousRegion(true);
			updateCursorPosition(currentRegion.start, currentRegion.end, true);
		});

		regions.on('region-updated', (region) => {						
			currentRegion.start = region.start;
			currentRegion.end = region.end;
			wavesurfer.setTime(currentRegion.start);
			if (presets.fadein.value > 0 || presets.fadeout.value > 0) {
				player.finalizeFades(progress, true, currentRegion.start, currentRegion.end);
				rerenderPeaks();
				progress = currentRegion.start / trackDuration * 100;
				if(isPlaying){
					play();
				};
			};

			if(player.soundtouch){
				player.soundtouch.percentagePlayed = currentRegion.start / wavesurfer.getDuration();
				wavesurfer.setTime(currentRegion.start);
			};	
			// Set the previous region and update cursor position		
			setPreviousRegion(true);
			updateCursorPosition(currentRegion.start, currentRegion.end, false);
		});

		// Event handler for interactions with the waveform
		wavesurfer.on('interaction', (newTime) => {
			if(!cuttingMode){
				player.soundtouch.percentagePlayed = newTime / wavesurfer.getDuration();
			} else {				
				// Handle region adjustments when in cutting mode
				if (newTime < currentRegion.start! || newTime > currentRegion.end!) {
					const allRegions = regions.getRegions();
					allRegions[0].remove();
					if(newTime > currentRegion.end!){
						// Add a new region if the new time extends beyond the current end
						regions.addRegion({
							start: currentRegion.start!,
							end: newTime,
							color: 'rgba(212, 64, 64, 0.4)',
						});
						wavesurfer.setTime(newTime - (trackDuration * 0.10));
						player.soundtouch.percentagePlayed = (newTime - (trackDuration * 0.10)) / wavesurfer.getDuration();
					} else {
						// Adjust the region if the new time is within the current range
						regions.addRegion({
							start: newTime,
							end: currentRegion.end!,
							color: 'rgba(212, 64, 64, 0.4)',
						});
					};
				} else {
					if(player.soundtouch){
						player.soundtouch.percentagePlayed = newTime / wavesurfer.getDuration();
					};
				};
			};
		});
	};

	//Extracts peak values from an audio buffer and organizes them into buckets
	function getPeaks(audioBuffer: AudioBuffer, NUMBER_OF_BUCKETS: number) {
		const decodedAudioData = audioBuffer.getChannelData(0);
		let bucketDataSize = Math.floor(decodedAudioData.length / NUMBER_OF_BUCKETS);
		let buckets = [];
		for (var i = 0; i < NUMBER_OF_BUCKETS; i++) {
			let startingPoint = i * bucketDataSize;
			let endingPoint = i * bucketDataSize + bucketDataSize;
			let max = 0;
			for (var j = startingPoint; j < endingPoint; j++) {
				if (decodedAudioData[j] > max) {
					max = decodedAudioData[j];
				}
			}
			let size = Math.abs(max);
			buckets.push(size / 2);
		}
		return buckets;
	};

	//Initializes the progress tracking for the audio player.
	function initProgress(){	
		// Set up an event listener for the 'play' event from SoundTouch
		player.soundtouch.on('play', (detail: { percentagePlayed: number; timePlayed: number; }) => {			
			progress = detail.percentagePlayed;
			animatedTime = detail.formattedTimePlayed
			wavesurfer.setTime(detail.timePlayed);
			// Reset percentagePlayed to 0 if it reaches 100%
			if(detail.percentagePlayed === 100){
				player.soundtouch.percentagePlayed = 0;
				wavesurfer.seekTo(0);
			};
			// Handle playback in cutting mode
			if(cuttingMode && detail.timePlayed > currentRegion.end!){
				// Jump back to the start of the current region if playback exceeds the end
				wavesurfer.setTime(currentRegion.start!);
				playPauseToggle = false;
				player.soundtouch.percentagePlayed = currentRegion.start! / wavesurfer.getDuration();
				player.pause();
			};
		});
	};

	//Handles the file input event to process an audio file, extract peak data, and initialize WaveSurfer.
	async function setPeaks(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = (target.files as FileList)[0];
		const url = URL.createObjectURL(file);
		const audioContext = new AudioContext();
		const response = await fetch(url);
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
		peaks = getPeaks(audioBuffer, 1200);
		setToDefault();
		initWavesurfer(url, peaks);
	};

	// Rerenders the peaks in WaveSurfer based on the modified audio buffer.
 	// Checks if the audio buffer has been modified, and if so, recalculates the peak data,
	// reloads the waveform, and restores the playback state if it was previously playing.
	function rerenderPeaks() {
		if (player.modifiedAudioBuffer) {
			playPauseToggle = false;
			peaks = getPeaks(player.modifiedAudioBuffer, 1200);
			wavesurfer.load(url, peaks, trackDuration);
			if (isPlaying) {
				playPauseToggle = true;
			};
		};
	};

	//  When entering cutting mode, adds a region based on the previous region or the entire track.
	//  When exiting cutting mode, clears all regions and resets the current region to cover the entire track.
	function initCuttingMode() {
		if (!wavesurfer) {
			return;
		};
		cuttingMode = !cuttingMode;
		if (cuttingMode) {
			// Add a region to the waveform if in cutting mode
			if (previousRegion.start && previousRegion.end) {
				// Use the previous region's start and end if available
				regions.addRegion({
					start: previousRegion.start,
					end: previousRegion.end,
					color: 'rgba(212, 64, 64, 0.4)',
				});
			} else {
				// Use the entire track duration if no previous region is set
				regions.addRegion({
					start: 0,
					end: trackDuration,
					color: 'rgba(212, 64, 64, 0.4)',
				});
			}
		} else {
			// Clear all regions when exiting cutting mode
			regions.clearRegions();
			currentRegion.start = 0;
			currentRegion.end = trackDuration;

			// Handle fade-in and fade-out presets if applicable
			if (presets.fadein.value > 0 || presets.fadeout.value > 0) {
				player.finalizeFades(progress, true, currentRegion.start, currentRegion.end);
				rerenderPeaks();
				if (isPlaying) {
					play();
				};
			};
		};
	};

	// Sets the playback position to the start of the current region
	function setToStartRegion() {
		wavesurfer.setTime(currentRegion.start!);
		if(player.soundtouch){
			player.soundtouch.percentagePlayed = currentRegion.start! / wavesurfer.getDuration();
		};
	};

	//Sets the playback position to the end of the current region, adjusted by 10% of the track duration.
	function setToEndRegion() {
		wavesurfer.setTime(currentRegion.end! - (trackDuration * 0.10));
		if(player.soundtouch){
			player.soundtouch.percentagePlayed = (currentRegion.end! - (trackDuration * 0.10)) / wavesurfer.getDuration();
		};
	};

	//Updates the cursor position based on the start and end of the region.
	function updateCursorPosition(start: number, end: number, initial: boolean) {
		// Set the initial region start and end positions
		if (initial === true) {
			initialRegion.start = start;
			initialRegion.end = end;
			return;
		};
		let regionDuration = end - start;
		const percentage = (regionDuration / trackDuration) * 100;
		switch (true) {
		case initialRegion.start !== start && initialRegion.end !== end:
			// Both start and end positions have changed
			setToStartRegion();
			initialRegion.start = start;
			initialRegion.end = end;
			break;
		case initialRegion.end !== end:
			// Only the end position has changed
			if (percentage <= 10) {
				// If the region is very small, reset to the start
				setToStartRegion();
			} else {
				// Otherwise, adjust to the end position
				setToEndRegion();
			}
			initialRegion.start = start;
			initialRegion.end = end;
			break;
		case initialRegion.start !== start:
			// Only the start position has changed
			setToStartRegion();
			initialRegion.start = start;
			initialRegion.end = end;
			break;
		};
	};

	// Updates the previous region based on the current region's start and end positions.
	function setPreviousRegion(define: boolean) {
		if (define) {
			previousRegion.start = currentRegion.start;
			previousRegion.end = currentRegion.end;
		} else {
			previousRegion.start = undefined;
			previousRegion.end = undefined;
		};
	};

	function togglePlay(){
		if(!player.audioContext){
			return
		};		
        playPauseToggle = !playPauseToggle;
        if (playPauseToggle) {
			play();
        } else {
			pause();
        };
    };

	function play(){	
		isPlaying = true;
		player.play(progress);
		initProgress();
	};

	function pause(){
		isPlaying = false;
		player.pause();
	};

	function onKeyDown(e: { keyCode: number; preventDefault: () => void; }) {        
        if (e.keyCode === 32) {
            e.preventDefault();
            togglePlay();
        };
 	};

	function setToDefault(){
	    for (const key in presets) {
			presets[key].value = presets[key].default;
		};
	};

	// Function to reset the fade-in value to its default
	function resetFadeIn() {
		if(presets.fadein.value === 0){
			return;
		};
		presets.fadein.value = presets.fadein.default;
		player.setFadeIn(presets.fadein.value, currentRegion.start!, currentRegion.end!);
		player.finalizeFades(progress, true, currentRegion.start!, currentRegion.end!);
		rerenderPeaks();
		progress = currentRegion.start! / trackDuration * 100;
		if(isPlaying){
			play();
		};
	};

	// Function to reset the fade-out value to its default
	function resetFadeOut() {
		if(presets.fadeout.value === 0){
			return;
		};
		presets.fadeout.value = presets.fadeout.default;
		player.setFadeOut(presets.fadeout.value, currentRegion.start!, currentRegion.end!);
		player.finalizeFades(progress, true, currentRegion.start!, currentRegion.end!);
		rerenderPeaks();
		progress = currentRegion.start! / trackDuration * 100;
		if(isPlaying){
			play();
		};
	};

	function formatTime(seconds: number) {
		let minutes = Math.floor(seconds / 60);
		let remainingSeconds = Math.floor(seconds % 60);
		
		// Pad with leading zeros if necessary
		let formattedMinutes = minutes.toString().padStart(2, '0');
		let formattedSeconds = remainingSeconds.toString().padStart(2, '0');
		return `${formattedMinutes}:${formattedSeconds}`;
	};

	onMount(async () => {
		setToDefault();
	});
</script>

<section class="flex flex-row items-center justify-center bg-[var(--background-color)]">
	<div class="flex items-center justify-center w-full h-screen">
		<div class="flex flex-col items-center justify-center gap-4 w-full bg-[var(--primary-color)] rounded-md mr-8 ml-12 p-4 neo">
			<div class="flex flex-row items-center justify-end gap-2 w-full">
				<button on:pointerdown={initCuttingMode} class="{cuttingMode === true ? "bg-[var(--hover-color)]" : ""} flex flex-row items-center cursor-pointer gap-2 p-2  rounded-md hover:bg-[var(--hover-color)] bg-[--button-color] neo">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6 h-6 fill-[--icon-color]">
						<path d="M256 192l-39.5-39.5c4.9-12.6 7.5-26.2 7.5-40.5C224 50.1 173.9 0 112 0S0 50.1 0 112s50.1 112 112 112c14.3 0 27.9-2.7 40.5-7.5L192 256l-39.5 39.5c-12.6-4.9-26.2-7.5-40.5-7.5C50.1 288 0 338.1 0 400s50.1 112 112 112s112-50.1 112-112c0-14.3-2.7-27.9-7.5-40.5L499.2 76.8c7.1-7.1 7.1-18.5 0-25.6c-28.3-28.3-74.1-28.3-102.4 0L256 192zm22.6 150.6L396.8 460.8c28.3 28.3 74.1 28.3 102.4 0c7.1-7.1 7.1-18.5 0-25.6L342.6 278.6l-64 64zM64 112a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm48 240a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
					</svg>
				</button>
				<label class="flex flex-row items-center cursor-pointer gap-2 p-2 rounded-md hover:bg-[var(--hover-color)] bg-[--button-color] neo">
					<input type="file" class="hidden" on:change={fileInput} on:change={setPeaks}/>
					<span class="uppercase font-bold text-[--text-color]">Select</span>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6 h-6 fill-[--icon-color]">
						<path d="M288 109.3L288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-242.7-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352l128 0c0 35.3 28.7 64 64 64s64-28.7 64-64l128 0c35.3 0 64 28.7 64 64l0 32c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64l0-32c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
					</svg>
				</label>
			</div>
			<div class="flex lg:flex-row flex-col items-center justify-center w-full gap-4">
				<button on:click={togglePlay} class="lg:order-first order-last p-4 rounded-full  hover:bg-[var(--hover-color)] bg-[--button-color] neo">
					{#if playPauseToggle}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"  class="w-6 h-6 fill-[--icon-color]">
							<path d="M48 64C21.5 64 0 85.5 0 112L0 400c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48L48 64zm192 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l32 0c26.5 0 48-21.5 48-48l0-288c0-26.5-21.5-48-48-48l-32 0z"/>
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-6 h-6 fill-[--icon-color]">
							<path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
						</svg>
					{/if}
				</button>
				<div class="flex flex-col items-center justify-center w-full gap-2 p-2 neo rounded-md">
					<div class="relative flex flex-col items-center justify-center w-full h-[100px]  rounded-md bg-[black]">
						<hr class="{wavesurfer ? "hidden" : "block"} border border-t-[#464646] border-dashed w-full">
						<div id="waveform" class="rounded-md w-full"></div>
						<div class="absolute bottom-0 flex items-center justify-between w-full p-1 text-[#464646]">
							<span class="text-xs">
								{animatedTime}
							</span>
							<span class="text-xs">
								{formatTime(trackDuration)}
							</span>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-row items-center justify-center w-full gap-2">
				<div class="flex flex-col items-center justify-center w-full gap-2">
					<div class="flex items-center justify-center w-full gap-2">
						<div class="flex flex-col items-center justify-center gap-1 w-full py-3  rounded-md ">
							<div class="flex flex-row items-center justify-center gap-2 w-full pr-4">
								<div class="flex items-center justify-between w-full px-4">
									<input 
										type="range" 
										class="range-style"
										min={presets.playbackrate.min} 
										max={presets.playbackrate.max} 
										step={presets.playbackrate.step}
										bind:value={presets.playbackrate.value}
										on:change={()=> {player.changePlaybackRate(presets.playbackrate.value)}}
									/>
								</div>
								<button on:click={()=>{
										presets.playbackrate.value = presets.playbackrate.default
										player.changePlaybackRate(presets.playbackrate.value);
									}}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-[--icon-color]">
										<path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"/>
									</svg>
								</button>
							</div>
							<div class="flex flex-row items-center justify-between w-full px-4">
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.playbackrate.name}</span>
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.playbackrate.value}</span>
							</div>
						</div>
						<div class="flex flex-col items-center justify-center gap-1 w-full py-3  rounded-md ">
							<div class="flex flex-row items-center justify-center gap-2 w-full pr-4">
								<div class="flex items-center justify-between w-full px-4">
									<input 
										type="range" 
										class="range-style"
										min={presets.gain.min} 
										max={presets.gain.max} 
										step={presets.gain.step}
										bind:value={presets.gain.value}
										on:change={()=> {player.changeVolume(presets.gain.value)}}
									/>
								</div>
								<button on:click={()=>{
										presets.gain.value = presets.playbackrate.default
										player.changeVolume(presets.playbackrate.value);
									}}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-[--icon-color]">
										<path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"/>
									</svg>
								</button>
							</div>
							<div class="flex flex-row items-center justify-between w-full px-4">
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.gain.name}</span>
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.gain.value}</span>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-center w-full gap-2">
						<div class="flex flex-col items-center justify-center gap-1 w-full py-3  rounded-md">
							<div class="flex flex-row items-center justify-center gap-2 w-full pr-4">
								<div class="flex items-center justify-between w-full px-4">
									<input 
										type="range" 
										class="range-style"
										min={presets.pitch.min} 
										max={presets.pitch.max} 
										step={presets.pitch.step}
										bind:value={presets.pitch.value}
										on:change={()=> {player.changePitch(presets.pitch.value)}}
									/>
								</div>
								<button on:click={()=>{
										presets.pitch.value = presets.pitch.default
										player.changePitch(presets.pitch.value);
									}}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-[--icon-color]">
										<path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"/>
									</svg>
								</button>
							</div>
							<div class="flex flex-row items-center justify-between w-full px-4">
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.pitch.name}</span>
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.pitch.value}</span>
							</div>
						</div>
						<div class="flex flex-col items-center justify-center gap-1 w-full py-3  rounded-md">
							<div class="flex flex-row items-center justify-center gap-2 w-full pr-4">
								<div class="flex items-center justify-between w-full px-4">
									<input 
										type="range" 
										class="range-style"
										min={presets.reverb.min} 
										max={presets.reverb.max} 
										step={presets.reverb.step}
										bind:value={presets.reverb.value}
										on:change={()=> {player.setReverbMix(presets.reverb.value)}}
									/>
								</div>
								<button on:click={()=>{
										presets.reverb.value = presets.reverb.default
										player.setReverbMix(presets.reverb.value);
									}}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-[--icon-color]">
										<path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"/>
									</svg>
								</button>
							</div>
							<div class="flex flex-row items-center justify-between w-full px-4">
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.reverb.name}</span>
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.reverb.value}</span>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-center w-full gap-2">
						<div class="flex flex-col items-center justify-center gap-1 w-full py-3  rounded-md">
							<div class="flex flex-row items-center justify-center gap-2 w-full pr-4">
								<div class="flex items-center justify-between w-full px-4">
									<input 
										type="range" 
										class="range-style"
										min={presets.bass.min} 
										max={presets.bass.max} 
										step={presets.bass.step}
										bind:value={presets.bass.value}
										on:change={()=> {player.setBass(presets.bass.value)}}
									/>
								</div>
								<button on:click={()=>{
										presets.bass.value = presets.bass.default;
										player.setBass(presets.bass.value);
									}}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-[--icon-color]">
										<path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"/>
									</svg>
								</button>
							</div>
							<div class="flex flex-row items-center justify-between w-full px-4">
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.bass.name}</span>
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.bass.value}</span>
							</div>
						</div>
						<div class="flex flex-col items-center justify-center gap-1 w-full py-3  rounded-md">
							<div class="flex flex-row items-center justify-center gap-2 w-full pr-4">
								<div class="flex items-center justify-between w-full px-4">
									<input 
										type="range" 
										class="range-style"
										min={presets.muffle.min} 
										max={presets.muffle.max} 
										step={presets.muffle.step}
										bind:value={presets.muffle.value}
										on:change={()=> {player.setMuffle(presets.muffle.value)}}
									/>
								</div>
								<button on:click={()=>{
										presets.muffle.value = presets.muffle.default;
										player.setMuffle(presets.muffle.value);
									}}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-[--icon-color]">
										<path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"/>
									</svg>
								</button>
							</div>
							<div class="flex flex-row items-center justify-between w-full px-4">
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.muffle.name}</span>
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.muffle.value}</span>
							</div>
						</div>
					</div>
					<div class="flex items-center justify-center w-full gap-2">
						<div class="flex flex-col items-center justify-center gap-1 w-full py-3  rounded-md">
							<div class="flex flex-row items-center justify-center gap-2 w-full pr-4">
								<div class="flex items-center justify-between w-full px-4">
									<input 
										type="range" 
										class="range-style"
										min={presets.fadein.min} 
										max={presets.fadein.max} 
										step={presets.fadein.step}
										bind:value={presets.fadein.value}
										on:mouseup={()=>{player.setFadeIn(presets.fadein.value, currentRegion.start, currentRegion.end)}}
										on:mouseup={rerenderPeaks}
										on:mouseup={()=>{player.finalizeFades(progress, true, currentRegion.start, currentRegion.end)}}
										on:mouseup={()=>{
											progress = currentRegion.start / trackDuration * 100
											if(isPlaying){
												play();
											};
										}}
									/>
								</div>
								<button on:click={resetFadeIn}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-[--icon-color]">
										<path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"/>
									</svg>
								</button>
							</div>
							<div class="flex flex-row items-center justify-between w-full px-4">
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.fadein.name}</span>
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.fadein.value}</span>
							</div>
						</div>
						<div class="flex flex-col items-center justify-center gap-1 w-full py-3  rounded-md">
							<div class="flex flex-row items-center justify-center gap-2 w-full pr-4">
								<div class="flex items-center justify-between w-full px-4">
									<input 
										type="range" 
										class="range-style"
										min={presets.fadeout.min} 
										max={presets.fadeout.max} 
										step={presets.fadeout.step}
										bind:value={presets.fadeout.value}
										on:mouseup={()=>{player.setFadeOut(presets.fadeout.value, currentRegion.start, currentRegion.end)}}
										on:mouseup={rerenderPeaks}
										on:mouseup={()=>{player.finalizeFades(progress, true, currentRegion.start, currentRegion.end)}}
										on:mouseup={()=>{
											progress = currentRegion.start / trackDuration * 100
											if(isPlaying){
												play();
											};
										}}
									/>
								</div>
								<button on:click={resetFadeOut}>
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 fill-[--icon-color]">
										<path d="M463.5 224l8.5 0c13.3 0 24-10.7 24-24l0-128c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l119.5 0z"/>
									</svg>
								</button>
							</div>
							<div class="flex flex-row items-center justify-between w-full px-4">
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.fadeout.name}</span>
								<span class="text-xs uppercase font-semibold text-[--text-color]">{presets.fadeout.value}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex flex-row items-center justify-end gap-2 w-full">
				<button on:click={()=>{player.renderOffline(currentRegion.start, currentRegion.end)}} class="flex flex-row items-center justify-center cursor-pointer gap-2 p-2  rounded-md hover:bg-[var(--hover-color)] bg-[--button-color] neo">
					<span class="uppercase font-bold text-[--text-color]">Render</span>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-6 h-6 fill-[--icon-color]">
						<path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</section>

<svelte:window on:keydown={onKeyDown} />