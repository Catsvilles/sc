<script lang="ts">
    import { goto } from '$app/navigation';
    import Icon from "$lib/components/Icon.svelte";

    let sidebar: boolean = false;

    async function scrollIntoView(toElement : string) {
        await goto('/');        
        const el = document.querySelector(toElement);
        if (!el) return;

        el.scrollIntoView({
            behavior: 'smooth'
        });
    }
</script>

<nav class="sticky top-0 flex items-center justify-between w-full p-6 primary-bg-color z-40 shadow-lg">
    <a href="/">
        <img src="/logo.svg" alt="Atmoscapes Logo" class="w-10 h-10 icon-color">
    </a>
    <div class="hidden lg:block">
        <div class="flex flex-row gap-6">
            <a href='/' class="menu-text">Home</a>
            <button on:click|preventDefault={()=>{scrollIntoView("#services")}} class="menu-text">Services</button>
            <button on:click|preventDefault={()=>{scrollIntoView("#portfolio")}} class="menu-text">Portfolio</button>
            <a href='/blog' class="menu-text">Blog</a>
            <a href='/contact' class="menu-text">Contact</a>
        </div>
    </div>
    <button on:pointerdown={()=>{ sidebar = !sidebar }} class="lg:hidden">
        <Icon name={"menu"} styles={"w-8 h-8 icon-color"}/>
    </button>
    <!-- <button class="hidden lg:block menu-text">
        menu
    </button> -->
</nav>
<div on:pointerdown={()=>{ sidebar = false }} class="{ sidebar === true ? "block" : "hidden" } fixed top-0 w-full h-full primary-bg-color opacity-75 z-40"></div>
<div class="fixed top-0 right-0 w-min h-full primary-bg-color z-40">
    <div class="{ sidebar === true ? "block" : "hidden" } flex flex-col">
        <button on:pointerdown={()=>{ sidebar = false }} class="flex justify-end w-full p-5">
            <Icon name={"close"} styles={"w-4 h-4 icon-color"}/>
        </button>
        <div class="flex flex-row items-center justify-center gap-36 border-t border-gray-400 p-4 icon-color menu-text cursor-pointer">
            <a href='/' class="w-12">Home</a>
            <Icon name={"arrow-right"} styles={"w-4 h-4"}/>
        </div>
        <div class="flex flex-row items-center justify-center gap-36 border-t border-gray-400 p-4 icon-color menu-text cursor-pointer">
            <button on:click|preventDefault={()=>{scrollIntoView("#services")}} class="w-12 uppercase">Services</button>
            <Icon name={"arrow-right"} styles={"w-4 h-4"}/>
        </div>
        <div class="flex flex-row items-center justify-center gap-36 border-t border-gray-400 p-4 icon-color menu-text cursor-pointer">
            <button on:click|preventDefault={()=>{scrollIntoView("#portfolio")}} class="w-12 uppercase">Portfolio</button>
            <Icon name={"arrow-right"} styles={"w-4 h-4"}/>
        </div>
        <div class="flex flex-row items-center justify-center gap-36 border-t border-gray-400 p-4 icon-color menu-text cursor-pointer">
            <a href='/blog' class="w-12">Blog</a>
            <Icon name={"arrow-right"} styles={"w-4 h-4"}/>
        </div>
        <div class="flex flex-row items-center justify-center gap-36 border-t border-gray-400 p-4 icon-color menu-text cursor-pointer">
            <a href='/contact' class="w-12">Contact</a>
            <Icon name={"arrow-right"} styles={"w-4 h-4"}/>
        </div>
    </div>
</div>
