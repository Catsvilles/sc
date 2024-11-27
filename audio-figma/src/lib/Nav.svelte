<script lang="ts">
    import { onMount, afterUpdate } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation'
    import Cookies from 'universal-cookie'
	import { cartTotalItems } from "../stores/cart";
    import { clickOutside } from './../helpers/';
    import ProjectModalButton from '$lib/ui/ProjectModalButton.svelte';
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { invalidate } from '$app/navigation';
    import {supabaseClient} from "$lib/supabase";
    import Logo from "$lib/Logo.svelte";

    onMount(() => {
        checkPageName();
    });

    afterUpdate(() => {
        checkPageName();
    });

    function checkPageName() {
        currentPath = window.location.pathname;
    }

    const cookies = new Cookies();

	let loading = false;
    let openProfileMenu = false;
    let openNavMenu = false;
    let openBurger = true;   
    let currentPath: string;

	let navtext = {
		home: "Home",
		explore: "Explore",
		license: "License",
	};

	const handleLogout: SubmitFunction = () => {
        signout()
		loading = true;
		return async ({ result }) => {
			if (result.type === 'redirect') {
				await invalidate('supabase:auth');
			} else {
				await applyAction(result);
			}
			loading = false;
		};
	};

    async function signout() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) {
			console.log("error", error);
		}
    };
</script>

<style>
.fa-stack[data-count]:after {
  position: absolute;
  right: 0%;
  top: 0%;
  content: attr(data-count);
  font-size: 45%;
  padding: .6em;
  border-radius: 999px;
  line-height: .75em;
  color: #8a005e;
  text-align: center;
  min-width: 2em;
  font-weight: bold;
  background: #fff;
  border-style: solid;
}
</style>
<header class="{currentPath === '/studio' ? 'bg-[#262626]' : 'bg-[#386771] bg-opacity-75'} sticky top-0 z-50 w-full shadow-lg">
        <div class="flex flex-wrap items-center justify-between w-full px-4 py-2">
            <button class="relative md:hidden block text-neutral-300 w-10 h-10 -ml-2 cursor-pointer focus:outline-none" 
                on:click="{() => openBurger = !openBurger}" 
                use:clickOutside={() => {
                            if(openBurger === false) {openBurger = true}
                        }
                    }
                use:clickOutside={() => {
                            if(openNavMenu === true) {openNavMenu = false }
                        }
                    } 
                on:click="{() => openNavMenu = !openNavMenu}">
                <div class="block w-5 absolute left-1/2 top-1/2   transform  -translate-x-1/2 -translate-y-1/2">
                    <span class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out {openBurger ? '': 'rotate-45'}{ !openBurger ? '': '-translate-y-1.5' }" ></span>
                    <span class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out {openBurger ? '': 'opacity-0'}" ></span>
                    <span class="block absolute h-0.5 w-5 bg-current transform transition duration-500 ease-in-out  {openBurger ? '': '-rotate-45'}{ !openBurger ? '': 'translate-y-1.5' }"></span>
                </div>
            </button>
            <div class="order-1 md:order-2">
                <a href="/"><Logo/></a>                
            </div>
            <div class="flex items-center order-2 md:order-3 text-neutral-300">
                <nav class="{openNavMenu ? '':'hidden'} absolute md:relative left-0 top-14 md:top-0 md:flex w-full bg-[#386771] bg-opacity-75 md:bg-inherit">
                    <ul class="md:flex items-center justify-between text-sm text-white ml-2 pt-1 md:pt-0 uppercase">
                        <li><a rel="prefetch" class="inline-block no-underline hover:underline py-2 px-2" href="/">Home</a></li>
                        <li><a rel="prefetch" class="inline-block no-underline hover:underline py-2 px-2" href="/studio">Studio</a></li>
                        <!-- <li><a class="inline-block no-underline hover:underline py-2 px-2" href="/license">License</a></li> -->
                        <!-- {#if $page.data.session}
                            <li><ProjectModalButton /></li>
                        {/if} -->
                    </ul>
                </nav>
                <!-- <a rel="prefetch" href="/cart" class="block cursor-pointer bg-[#333333] shadow-lg border border-transparent hover:border-gray-500 p-1.5 rounded-full transform transition hover:scale-110 duration-300">
                    <span>
                        <svg class="h-6 w-6 fill-black" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none"><path d="M6.01 16.136L4.141 4H3a1 1 0 0 1 0-2h1.985a.993.993 0 0 1 .66.235a.997.997 0 0 1 .346.627L6.319 5H14v2H6.627l1.23 8h9.399l1.5-5h2.088l-1.886 6.287A1 1 0 0 1 18 17H7.016a.993.993 0 0 1-.675-.248a.999.999 0 0 1-.332-.616zM10 20a2 2 0 1 1-4 0a2 2 0 0 1 4 0zm9 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0zm0-18a1 1 0 0 1 1 1v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0V6h-1a1 1 0 1 1 0-2h1V3a1 1 0 0 1 1-1z" fill="#e5e7eb"/></g></svg>
                        <div class="fa-stack has-badge z-10" data-count="{$cartTotalItems}"></div>  
                    </span>
                </a> -->
            {#if $page.data.session}
                <div class="relative border-transparent ml-2">
                    <div on:pointerdown="{() => openProfileMenu = !openProfileMenu}"
                        use:clickOutside={() => { openProfileMenu = false }}
                        class="flex justify-center items-center space-x-1 cursor-pointer">
                    <div class="w-8 h-8 rounded-full overflow-hidden border-2 dark:border-white border-gray-500">
                        <img src="https://images.unsplash.com/photo-1610397095767-84a5b4736cbd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" alt="" class="w-full h-full object-cover">
                    </div>
                    <div class="hidden sm:block font-semibold text-neutral-300 text-sm">
                        <div class="cursor-pointer">{$page.data.session.user.user_metadata.user}</div>
                    </div>
                </div>
            <div class="{openProfileMenu ? '': 'hidden'} {currentPath === '/studio' ? 'bg-[#262626]' : 'bg-[#386771]'} absolute w-52 px-5 py-3 rounded-lg shadow mt-4 right-8">
                <div class="hidden sm:block font-semibold text-neutral-300 text-sm">
                    <div class="cursor-pointer">{$page.data.session.user.user_metadata.user || $page.data.session.user.user_metadata.email}</div>
                </div>
                <ul class="space-y-3 text-gray-200">
                    <!-- <li class="font-medium">
                    <a href="/my" class="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-orange-700">
                        <div class="mr-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        Dashboard
                    </a>
                    </li>
                    <li class="font-medium">
                    <a href="/projects" class="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-orange-700">
                        <div class="mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                        </div>
                        Projects
                    </a>
                    </li>
                    <li class="font-medium">
                    <a href="/my/items" class="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-orange-700">
                        <div class="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                       Items
                    </a>
                    </li>
                    <li class="font-medium">
                    <a href="/my/settings"  class="flex items-center transform transition-colors duration-200 border-r-4 border-transparent hover:border-orange-700">
                        <div class="mr-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        Settings
                    </a>
                    </li> -->
                    <hr class="dark:border-gray-700">
                    <li class="font-medium">
                        <form action="/logout" method="post" use:enhance={handleLogout}>
                            <button disabled={loading} type="submit">Sign out</button>
                        </form>
                    </li>
                </ul>
                </div>
            </div>
            {:else}
                <a href="/login" class="ml-2 text-sm font-semibold tracking-wide hover:text-primary-500 cursor-pointer bg-[#333333] border border-transparent hover:border-gray-500 p-1.5 rounded-full transform transition hover:scale-110 duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                </a>
            {/if}
        </div>
    </div>
</header>
