<script lang="ts">
    import { goto } from '$app/navigation';
    import Icon from "$lib/components/Icon.svelte";

    async function scrollIntoView(toElement : string) {
        await goto('/');        
        const el = document.querySelector(toElement);
        if (!el) return;

        el.scrollIntoView({
            behavior: 'smooth'
        });
    }
</script>
<div class="flex flex-col gap-4 lg:flex-row items-center justify-between w-full p-6">
    <div class="flex flex-col gap-4 items-start p-4 w-full lg:w-4/12 text-white text-sm">
        <Icon name={"logo"} styles={"w-10 h-10 icon-color"}/>
        <span>© {new Date().getFullYear()} atmoscapes.com - All rights reserved.</span>
    </div>
    <div class="flex flex-col items-center gap-4 w-full lg:w-4/12">
        <div class="flex flex-wrap items-center justify-center lg:flex-row gap-6">
            <a href='/' class="menu-text">Home</a>
            <button on:click|preventDefault={()=>{scrollIntoView("#services")}} class="menu-text">Services</button>
            <button on:click|preventDefault={()=>{scrollIntoView("#portfolio")}} class="menu-text">Portfolio</button>
            <a href='/blog' class="menu-text">Blog</a>
            <a href='/contact' class="menu-text">Contact</a>
        </div>
        <div class="flex flex-row gap-6">
            <Icon name={"telegram"} styles={"w-8 h-8 icon-color"} />
            <Icon name={"instagram"} styles={"w-8 h-8 icon-color"} />
            <Icon name={"facebook"} styles={"w-8 h-8 icon-color"} />
            <Icon name={"reddit"} styles={"w-8 h-8 icon-color"} />
        </div>
    </div>
    <div class="flex flex-col items-start lg:items-end gap-2 text-white text-sm w-full lg:w-4/12 p-4">
        <!-- <span class="flex items-center justify-center">Made with&nbsp<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>&nbspin following countries:</span>
        <span>Ukraine, Germany, Bulgaria</span>
        <span>hi@atmoscapes.com</span> -->
    </div>
</div>