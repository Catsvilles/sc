<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
    import Link from "$lib/components/Link.svelte";
    import Carousel from '$lib/components/Carousel.svelte';
    import { logos } from "$lib/svg";
	import { Slidy } from "@slidy/svelte";
	import { flip } from '@slidy/animation';
	import '@slidy/svelte/dist/slidy.css';

	let currentSlide: { type: string; title: string; videoSrc: any; src: any; } | null = null;
	let index = 0;
	let position = 0;

	const slides = [{
			id: 0,
			type: "image",
			title: "Collaborative Audio Editor for Podcast Company",
			body: "The challenge was creating a Collaborative Audio Editor and Cloud Hosted Audio Admin Dashboard for a prominent Podcast Company.",
			width: 200,
			height: 300,
			src: "portfolio/1.png",
			link: {
				href: "",
				external: false,
			}
		},
		{
			id: 1,
			title: "Cross Platform Collaborative Audio Editing Studio",
			body: "A beautiful and elegant audio editor and stereo effects manipulator work in any browser for cross-platform mobility. Made with JavaScript/TypeScript, Web Audio API, Supabase, SvelteKit",
			width: 200,
			height: 300,
			src: "portfolio/2.png",
			link: {
				href: "https://sc-kappa.vercel.app/",
				external: true,
			}
		},
		{
			id: 2,
			type: "image",
			title: "Innovative Audio Editor with Web Audio API",
			body: "A beautiful and elegant audio editor and stereo effects manipulator work in any browser for cross-platform mobility. Made with JavaScript/TypeScript, Web Audio API, Supabase, SvelteKit",
			width: 200,
			height: 300,
			src: "portfolio/3.png",
			link: {
				href: "",
				external: false,
			}
		},
		{
			id: 3,
			type: "video",
			title: "AI Music Generator and Web Based Collaborative DAW",
			body: "Online app for creating atmospheric soundtracks and ambient music and sync with videos and visual media. Made WIth Typescript, Web Audio API, Tailwind, Sveltekit",
			width: 200,
			height: 300,
			src: "portfolio/atmoscapia-preview.png",
			videoSrc: "portfolio/Atmoscapia.mp4",
			link: {
				href: "https://atmoscapia.com",
				external: true,
			}
		},
		{
			id: 4,
			type: "video",
			title: "Generative AI Immersive Art and Music",
			body: "Mesmerizing Ethereal Audio and Visual ASMR Soundscapes. All the music is generated via custom synths, there are no samples used. Made with Web Audio API and Webgl Graphics",
			width: 200,
			height: 300,
			src: "portfolio/ethcapia-preview.png",
			videoSrc: "portfolio/Ethcapia.mp4",
			link: {
				href: "https://ethcapia.com",
				external: true,
			}
		},
		{
			id: 5,
			type: "image",
			title: "Advanced Audio Player with DSP Effects",
			body: "The most advanced music player on the internet! Featuring effects such as pitch shift, real-time visual fades, reverb, muffle, bass booster, speed, and gain. You can even render and offline export your modified files.",
			width: 200,
			height: 300,
			src: "portfolio/ncore.png",
			link: {
				href: "https://ncore.vercel.app/",
				external: true,
			}
		},
		{
			id: 6,
			type: "video",
			title: "Ableton like music mixer for NFT music project",
			body: "Made with Typesccript, Sveltekit, TailwindCSS, Web Audio API. Features EQ, Sidechaining and Audio Automations",
			width: 200,
			height: 300,
			src: "portfolio/mixer-one-preview.png",
			videoSrc: "portfolio/Mixer-One.webm",
			link: {
				href: "https://mixer-one.vercel.app/",
				external: true,
			}
		},
		{
			id: 7,
			type: "image",
			title: "Spotify like generative AI music platform",
			body: "Think of it as a Spotify for ambient music but with a twist: the music is created in real-time, tailored to the listener’s environment or preferences.",
			width: 200,
			height: 300,
			src: "portfolio/genbient.jpeg",
			videoSrc: "",
			link: {
				href: "https://genbient.com",
				external: true,
			}
		},


	];
	let carouselOptions = {
		slides: slides,
		animation: flip,
		arrows: true,
		snap: 'center',
		counter: false,
		thumbnail: true,
		progress: false, // does not work on MS Edge
		loop: true,			  
	};

	function goToSlide(id: number) {
		index = Number(id);		
	};

	function handleScroll() {
		currentSlide = null;
	};

	function setCurrentSlide(item, index) {
		//Make sure we open in full view only the active item
		if (item.id !== index) {
			return;
		}

		currentSlide = item;
	}

	onMount(async () => {
		window.addEventListener('scroll', handleScroll);
	});
</script>
<section class="flex flex-col relative gap-4 items-center justify-center w-full h-full mt-2">
    <h1 class="section-title z-20 grayscale-0">
        PORTFOLIO
	</h1>
	<main>
		<Slidy {...carouselOptions}
			bind:index
			bind:position
			let:item
		>
		<div role="presentation" class="flex flex-col gap-4 items-center justify-center text-white px-4" style="width: 400px; height:100%;" on:click={()=>goToSlide(item.id)}>
			<h2 class="text-center text-[gray] text-2xl font-semibold px-8 h-full w-full uppercase">
				{item.title}
			</h2>
			{#if item.type === "video"}
				<video
				on:pointerdown={()=>{setCurrentSlide(item, index)}}
				loop
				muted
				controls
				class="{item.id !== index ? "" : "cursor-zoom-in "}object-fit w-full h-full md:h-full"
				id="iris"
				>
				<source
				src="{item.videoSrc}"
				type="video/mp4"
				/>
				Your browser does not support the video tag.
				</video>
			{:else}
				<img on:pointerdown={()=>{setCurrentSlide(item, index)}} src="{item.src}" alt="{item.title}" class="{item.id !== index ? "" : "cursor-zoom-in "}object-fit w-full h-full md:h-full">
			{/if}
			<h3 class="text-justify py-4 px-8 text-md text-gray-200">
				{item.body}
			</h3>
			{#if item.link.href !== ""}
				<Link path={item.link.href} external={item.link.external} content={'Demo'}/>	
			{/if}
		</div>
		</Slidy>
	</main>
</section>

{#if currentSlide}
	<div 
	role="presentation"
	transition:fade|global={{ delay: 250, duration: 600 }}
	on:click={()=>{currentSlide = null}} class="{currentSlide ? "block" : "hidden" } fixed flex items-center justify-center top-0 w-full h-full trasition duration-2000 ease-out z-40 cursor-zoom-out">
		<div class="absolute bg-black opacity-90 w-full h-full"></div>
		{#if currentSlide.type === "video"}
			<video src={currentSlide.videoSrc} 
				loop
				muted
				controls
				class="z-50 w-8/12 h-fit">
			</video>
		{:else}
			<img src={currentSlide.src} alt="{currentSlide.title}" class="z-50">
		{/if}
	</div>
{/if}
<!-- <div class="flex items-center justify-center flex-wrap lg:flex-row w-full px-8 gap-12 lg:gap-24">
	{#each data.posts as { slug, title, author, description, date, image, category }}
		<PortfolioArticle {slug} {title} {author} {date} {description} {image} {category}/> 
	{/each}
</div> -->
<slot />

<style>
	main {
		--slidy-thumbnail-size: 100px;
	}
</style>