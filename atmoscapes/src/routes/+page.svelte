<script lang="ts">
    import type { PageData } from './$types';
    import { paginate } from 'svelte-paginate';
    import Icon from "$lib/components/Icon.svelte";
    import Link from "$lib/components/Link.svelte";
    import Generative from "$lib/components/Generative.svelte";
    import Carousel from '$lib/components/Carousel.svelte';
    import PortfolioArticle from '$lib/articles/PortfolioArticle.svelte';
    import { logos } from "$lib/svg";
    import { Slidy } from "@slidy/svelte";
	import { flip } from '@slidy/animation';
	import '@slidy/svelte/dist/slidy.css';
    import { sortedBlogPosts } from "$lib/posts";
    import { onMount } from 'svelte';

    //Make sure we display only 4 posts on this page
    sortedBlogPosts.length = Math.min(sortedBlogPosts.length, 4);
    
    let tab = "WEB";



    onMount(async () => {
        let videoElement = document.getElementById('herovideo'); 
        let videoList = ['portfolio/Mixer-One.webm', 'portfolio/Atmoscapia.mp4', 'portfolio/Ethcapia.mp4']; // replace with your actual video sources let currentVideoIndex = 0;
        let currentVideoIndex = 0;
        videoElement.src = videoList[currentVideoIndex]; // start with the first video videoElement.play();
        videoElement.addEventListener('ended', function() { // when a video ends, increment currentVideoIndex, and load the next video currentVideoIndex++;
        currentVideoIndex++;
        
        if(currentVideoIndex >= videoList.length) {
            currentVideoIndex = 0;
        }

        // set the source to the next video in the list, and play
        videoElement.src = videoList[currentVideoIndex];
        videoElement.play();        
    });
	});
</script>
<svelte:head>
	<title>Atmoscapes - Web Audio API & Generative AI Music Software Development</title>
    <meta name="description" content="Your Creative Partner Developer of Premium Browser and Mobile Media Applications: Audio Editors, Music DAWs, Visualizers, Video Editors, SaaS & Marketplaces, Generative AI and Streaming Services" />
</svelte:head>
<section class="relative flex items-center justify-center h-screen overflow-hidden">
    <div class="absolute z-20 inset-0 bg-black opacity-80"></div>
    <div class="relative z-20 p-5">
        <div class="flex items-center mx-auto max-w-screen-xl px-4 py-16 lg:h-screen text-white">
            <div class="flex flex-col gap-6 mx-auto text-center">
                <h1 class="lg:text-7xl font-semibold text-5xl uppercase">
                    Your Creative Partner in Web Audio & Music Software Development
                </h1>
                <h2 class="mx-auto max-w-xl text-xl lg:text-2xl">
                    Premium Browser and Mobile Media Applications: Audio Editors, Music DAWs, Visualizers, Video Editors, SaaS & Marketplaces, Generative AI and Streaming Services
                </h2>
                <a href="/contact" class="py-4 px-8 bg-orange-600 hover:bg-gray-500 transition duration-1000 text-white uppercase text-sm mx-auto vhs">
                    Contact Us
                </a>
            </div>
        </div>
    </div>
    <video id="herovideo" autoplay muted class="absolute z-10 w-auto min-w-full min-h-full max-w-none grayscale">
      <source src="portfolio/Ethcapia.mp4" type="video/mp4" />Your browser does not support the video tag.
    </video>
</section>
<section id="services" class="flex flex-col relative gap-12 items-center justify-center w-full py-24 mb-4 vhs">
    <div class="absolute w-full h-full bg-[url('/micro.jpg')] bg-center bg-cover bg-fixed grayscale"></div>
    <div class="absolute z-10 inset-0 w-full h-full bg-black opacity-75"></div>
    <span class="section-title z-20 grayscale-0">
        What We Do
    </span>
    <div class="flex flex-col z-20">
        <div class="flex flex-col items-center w-full">
            <div class="flex flex-wrap gap-4 lg:gap-12 text-2xl font-bold items-center justify-center">
                <button on:pointerdown={()=>{ tab = 'WEB' }} class="{tab === 'WEB' ? 'text-white' : 'text-[gray]'} uppercase">
                    Web Audio Applications
                </button>
                <button on:pointerdown={()=>{ tab = 'AI' }} class="{tab === 'AI' ? 'text-white' : 'text-[gray]'} uppercase">
                    AI Audio & Music
                </button>
                <button on:pointerdown={()=>{ tab = 'MOBILE' }} class="{tab === 'MOBILE' ? 'text-white' : 'text-[gray]'} uppercase">
                    Mobile Audio & Music
                </button>
                <button on:pointerdown={()=>{ tab = 'GRAPHIC' }} class="{tab === 'GRAPHIC' ? 'text-white' : 'text-[gray]'} uppercase">
                    Graphic & Visual
                </button>
            </div>
            <!-- <img src="landing/mobile.jpg" class="{tab === 'MOBILE' ? 'block' : 'hidden'} h-64 w-64 rounded-full m-8 lg:m-20" alt="Mobile Audio Applications"> -->
            <!-- <img src="landing/graphic.jpg" class="{tab === 'GRAPHIC' ? 'block' : 'hidden'} h-64 w-64 rounded-full m-8 lg:m-20" alt="Graphic & Visual Applications"> -->
        </div>
        <div class="flex flex-col items-center w-full">
            <div class="{tab === 'WEB' ? 'block' : 'hidden'} flex flex-col md:flex-row gap-12 items-center justify-center w-full lg:w-2/3 text-white mt-16">
                <img src="landing/webaudio.jpg" class="{tab === 'WEB' ? 'block' : 'hidden'} h-64 w-64 rounded-full m-2 lg:m-4" alt="Web Audio Applications">
                <div class="flex flex-col gap-4 items-start justify-start">
                    <h3 class="text-center text-gray-200 text-2xl font-semibold uppercase">
                        We make the web sound better!
                    </h3>
                    <p class="text-justify tracking-wide text-gray-200 text-lg font-light">
                        Create immersive audio experiences with our expertly crafted Web Audio applications. We specialize in developing beautiful and stylish audio and music players, advanced audio editors, intuitive music sequencers, dynamic shops and marketplaces, engaging educational platforms, powerful DAWs, stunning visualizers, cutting-edge synthesizers, versatile MIDI apps, seamless podcast editing and streaming platforms, innovative AI and generative music software, robust SAAS solutions, and real-time collaboration platforms.
                    </p>
                    <Link path={'#portfolio'} content={'Learn More'}/>
                </div>
            </div>
            <div class="{tab === 'AI' ? 'block' : 'hidden'} flex flex-col md:flex-row gap-12 items-center justify-center w-full lg:w-2/3 text-white mt-16">
                <img src="landing/ai.jpg" class="{tab === 'AI' ? 'block' : 'hidden'} h-64 w-64 rounded-full m-2 lg:m-4" alt="Development of AI Audio and Music Applications">
                <div class="flex flex-col gap-2 items-start justify-start">
                    <h3 class="text-center text-gray-200 text-2xl font-semibold uppercase">
                        Generative AI Audio & Music Experiences
                    </h3>
                    <p class="text-justify tracking-wide text-gray-200 text-lg font-light">
                        Explore the future of sound with our AI-powered audio and music applications. From intelligent music composition to adaptive soundscapes, our solutions harness the power of artificial intelligence to create dynamic, personalized audio experiences. Whether you're developing interactive soundtracks, generative music, or smart audio tools, our AI-driven technology transforms creativity into reality, pushing the boundaries of what's possible in music and sound design.
                    </p>
                    <Link path={'#portfolio'} content={'Learn More'}/>
                </div>
            </div>
            <div class="{tab === 'MOBILE' ? 'block' : 'hidden'} flex flex-col md:flex-row gap-12 items-center justify-center w-full lg:w-2/3 text-white mt-16">
                <img src="landing/mobile.jpg" class="{tab === 'MOBILE' ? 'block' : 'hidden'} h-64 w-64 rounded-full m-2 lg:m-4" alt="Mobile Audio and Music Applications Development">
                <div class="flex flex-col gap-2 items-start justify-start">
                    <h3 class="text-center text-gray-200 text-2xl font-semibold uppercase">
                        Cutting-Edge Mobile Audio Solutions
                    </h3>
                    <p class="text-justify tracking-wide text-gray-200 text-lg font-light">
                        Elevate your audio experiences on the go with our comprehensive mobile audio applications. From sleek and responsive audio players to advanced music creation tools, we design and develop mobile solutions that include intuitive audio editors, feature-rich music sequencers, convenient podcasting apps, real-time collaboration tools, AI-driven music composition, immersive audio visualizers, mobile DAWs, educational apps, and personalized music streaming services, meditation apps. Our mobile audio applications are designed for seamless performance and exceptional user engagement.
                    </p>
                    <Link path={'#portfolio'} content={'Learn More'}/>
                </div>
            </div>
            <div class="{tab === 'GRAPHIC' ? 'block' : 'hidden'} flex flex-col md:flex-row gap-12 items-center justify-center w-full lg:w-2/3 text-white mt-16">
                <img src="landing/graphic.jpg" class="{tab === 'GRAPHIC' ? 'block' : 'hidden'} h-64 w-64 rounded-full m-2 lg:m-4" alt="Creative Graphic & Visual Applications Development">
                <div class="flex flex-col gap-2 items-start justify-start">
                    <h3 class="text-center text-gray-200 text-2xl font-semibold uppercase">
                        Immersive Graphic & Visual Solutions
                    </h3>
                    <p class="text-justify tracking-wide text-gray-200 text-lg font-light">
                        We offer a wide range of services, including interactive visualizers, stunning 2D and 3D animations, immersive WebGL graphics, sophisticated photo and video editors, captivating visual effects tools, dynamic graphic design software, intuitive drawing and painting apps, engaging visual storytelling platforms, advanced generative art applications, and real-time rendering solutions. Additionally, we specialize in developing games, interactive and immersive applications, audio visualizers, AR and VR experiences, audio-responsive apps, data visualizing applications, and comprehensive WebGL, Canvas, and SVG solutions.</p>
                        <Link path={'#portfolio'} content={'Learn More'}/>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- <section class="flex flex-col items-center justify-center gap-10 mb-24 bg-[#171717]">
    <span class="section-title">How We Do It</span>
    <div class="flex items-center justify-center flex-wrap lg:flex-row w-full px-8 gap-12 lg:gap-24">
        <div class="flex flex-col gap-4 group h-96 lg:w-72">
                <div class="vhs">
                    <img src="landing/research.jpg" alt="Web Audio Research and Brief">
                </div>
                <span class="text-xl text-white uppercase group-hover:animate-rotate-x border-b-2 border-orange-800 pb-4">Research and Brief</span>
                <Link path={'/'} content={'Read More'}/>
        </div>
        <div class="flex flex-col gap-4 group h-96 lg:w-72">
            <div class="flex flex-col gap-4 order-2 lg:order-1">
                <span class="text-xl text-white uppercase group-hover:animate-rotate-x border-b-2 border-orange-800 pb-4">Mockups & Design</span>
                <Link path={'/'} content={'Read More'}/>
            </div>
            <div class="order-1 lg:order-2 vhs">
                <img src="landing/mockups.jpg" alt="Web Audio Applications Mockups & Design">
            </div>
        </div>
        <div class="flex flex-col gap-4 group h-96 lg:w-72">
            <div class="vhs">
                <img src="landing/coding.jpg" alt="Development of Web Audio and Mobile Music Applications">
            </div>
            <span class="text-xl text-white uppercase group-hover:animate-rotate-x border-b-2 border-orange-800 pb-4">Milestones Development</span>
            <Link path={'/'} content={'Read More'}/>
        </div>
    </div>
</section> -->
<section class="flex flex-col items-center justify-center gap-10 pb-24 pt-24 bg-[#171717]">
    <span class="section-title">ALLIES</span>
    <Carousel autoplay={10000}>
        {#each logos as logo}
            <div class="flex flex-col items-center justify-center gap-4 text-white">
                <div class="flex items-center justify-center lg:w-44 lg:h-44 h-16 w-16" >
                    <img src={logo.svg} alt="We use {logo.name} for audio and music applications development" class="w-full h-full">
                </div>
                <a class="text-center" target="_blank" href={logo.link}>{logo.name}</a>
            </div>
        {/each}
    </Carousel>
</section>
<section class="flex flex-col w-full h-full gap-4 mb-40">
    <div class="flex items-center justify-center w-full h-full bg-[url('/dj.jpg')] bg-center bg-cover bg-fixed text-white vhs">
        <div class="flex flex-col gap-8 items-center justify-center py-40">
            <!-- <button class="flex items-center gap-4 icon-color menu-text transform hover:translate-x-4">
                <Icon name={"play"} styles={"w-20 h-20"}/>
                <span class="text-xl">PLAY VIDEO</span>
            </button> -->
            <h2 class="text-4xl lg:text-6xl font-semibold text-center uppercase">Professional Creative Suites, Now Possible in Your Browser!</h2>
        </div>
    </div>
    <div class="flex flex-wrap lg:flex-row items-center justify-center gap-6">
        <div class="flex items-center border-r-2 border-gray-500 px-4 w-56 group transition duration-1000 hover:border-orange-800">
            <span class="font-neon text-6xl lg:text-8xl text-[gray]">8</span>
            <span class="text-white -ml-4 w-min text-xs font-medium transition duration-1000 group-hover:text-orange-800 transform group-hover:translate-x-4 uppercase">Years Of Experience</span>
        </div>
        <div class="flex items-center border-r-2 border-gray-500 px-4 w-56 group transition duration-1000 hover:border-orange-800">
            <span class="font-neon text-6xl lg:text-8xl text-[gray]">79</span>
            <span class="text-white -ml-4 w-min text-xs font-medium transition duration-1000 group-hover:text-orange-800 transform group-hover:translate-x-4 uppercase">Successful Projects</span>
        </div>
        <div class="flex items-center border-r-2 border-gray-500 px-4 w-56 group transition duration-1000 hover:border-orange-800">
            <span class="font-neon text-6xl lg:text-8xl text-[gray]">60</span>
            <span class="text-white -ml-4 w-min text-xs font-medium transition duration-1000 group-hover:text-orange-800 transform group-hover:translate-x-4 uppercase">Happy Clients</span>
        </div>
        <div class="flex items-center border-r-2 border-gray-500 px-4 w-56 group transition duration-1000 hover:border-orange-800">
            <span class="font-neon text-6xl lg:text-8xl text-[gray]">99</span>
            <span class="text-white -ml-4 w-min text-xs font-medium transition duration-1000 group-hover:text-orange-800 transform group-hover:translate-x-4 uppercase">FL-Studio Requests</span>
        </div>
    </div>
</section>
<section id="portfolio" class="flex flex-col items-center justify-center w-full h-full mb-24 gap-12">
    <div class="flex flex-col lg:flex-row gap-4 lg:items-end justify-end w-full px-12">
        <Link path={'/'} content={'view all'}/>
    </div>
    <div class="flex flex-wrap justify-center lg:gap-10 gap-4">
        <PortfolioArticle /> 
    </div>
</section>
<section class="flex flex-col relative gap-12 items-center justify-center w-full py-24">
    <div class="absolute w-full h-full bg-[url('/casette.jpg')] bg-center bg-cover bg-fixed grayscale"></div>
    <div class="absolute z-10 inset-0 w-full h-full bg-black opacity-75"></div>
    <h3 class="lg:text-6xl text-5xl uppercase text-[gray] text-center font-neon z-20 grayscale-0 px-12">
        We use art to create software that creates art
    </h3>
    <div class="flex flex-col md:flex-row gap-12 items-center justify-center w-full lg:w-2/3 text-white z-20">
        <img src="landing/art.jpg" class="h-64 w-64 rounded-full m-2 lg:m-4" alt="Web Audio Music Applications in Browser and Mobile">
        <div class="flex flex-col gap-4 items-start justify-start">
            <p class="text-justify tracking-wide text-gray-200 text-lg font-light">
                At Atmoscapes, creativity is at the heart of everything we do. Our passion for art drives us to develop cutting-edge software that empowers artists, musicians, and creators to bring their visions to life. From immersive Web Audio applications to stunning WebGL graphics, we blend technology and creativity to craft tools that inspire and elevate your artistic expression. Whether you're a professional or a hobbyist, our tools are designed to help you create your masterpiece.
            </p>
        </div>
    </div>
</section>
<section class="flex flex-col items-center justify-center w-full h-full pb-24 pt-24 gap-12 bg-[#171717] vhs">
    <div class="flex flex-col lg:flex-row gap-4 items-center justify-center w-full px-12">
        <span class="section-title">
            Latest Articles
        </span>
    </div>
    <div class="flex lg:items-start items-center justify-start lg:flex-row flex-col gap-6 z-20">
        {#each sortedBlogPosts as post (post.id)}
            <div class="relative flex flex-col gap-6 lg:w-72 w-full max-h-min">
                <span class="absolute px-4 py-2 bg-orange-800 text-xs text-white font-medium uppercase">
                    {post.parsedDate?.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                </span>
                <div class="w-64 h-64 relative">
                    {#if post.image === ""}
                        <Generative title={post.title} />
                    {:else}
                        <img class="h-full w-full object-cover" src={post.image} alt="{post.title}">
                    {/if}
                </div>
                <a class="text-xl text-start text-white uppercase pl-4 border-l-2 border-orange-800 transition duration-1000 hover:text-orange-800 border-orange-800 transform hover:translate-x-4" href={post.link}>
                    {post.title}
                </a>
            </div>
        {/each}
    </div>
    <Link path={'/blog'} content={'view all'}/>
</section>
<section class="relative flex flex-col items-center justify-center w-full h-full gap-12 bg-gray-300 p-12">
    <span class="text-xl uppercase">
        Drop us a message
    </span>
    <form action="" class="flex items-center justify-center gap-2">
        <!-- <input type="text" placeholder="Mail" class="appearance-none outline-none border-b-2 border-orange-800 bg-gray-300 p-2 uppercase"> -->
        <a href="/contact" class="flex items-center justify-center gap-2">
            <span class="appearance-none outline-none border-b-2 border-orange-800 bg-gray-300 p-2 uppercase w-40"></span>
            <Icon name={"plane"} styles={"w-7 h-7 icon-color"} />
        </a>
    </form>
    <p class="text-center lg:w-3/6">
        Get in Touch with Our Web Audio API & Music Creative Software Developer
    </p>
    <svg class="absolute hidden lg:block -top-10 right-0 w-64 h-64">
        <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
           <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="gray"></circle>
        </pattern>
        <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
    </svg>
    <svg class="absolute hidden lg:block -bottom-10 left-0 w-64 h-64">
        <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
           <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="gray"></circle>
        </pattern>
        <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
    </svg>
</section>





