<script lang="ts">
  import { ScrollableArrow, ScrollableArrowItem } from "svelte-scrollable-arrow"
  import { onMount } from "svelte"
  import { page } from "$app/stores"
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
    Card,
  } from "konsta/svelte"
  import Menu from "$lib/components/Menu.svelte"
  import FooterPlayer from "$lib/components/FooterPlayer.svelte"
  import Sidebar from "$lib/components/Sidebar.svelte"

  export let data

  let categories = data.categories
  let card: HTMLDivElement
  let cardheight: number
  let panelOpened = false

  $: isHome = $page.url.pathname === "/"
  $: playlist = data.playlist
  $: currentCategory = categories.find(
    (category: Category) => category.slug === data.slug,
  )

  onMount(async () => {
    updateCardWidth()
    window.addEventListener("resize", updateCardWidth)
  })

  function updateCardWidth() {
    if (card) {
      cardheight = card.offsetWidth
    }
  }

  let backgroundColor = {
    bgMaterial: "bg-[var(--background-color)]",
  }
</script>

<Page colors={backgroundColor} class="flex">
  <a
    href="/"
    class="hidden lg:block w-3/12 sticky top-0 border-r-2 border-[var(--navbar-color)]"
  >
    <div class="flex flex-row items-center justify-center gap-2 py-4">
      <div
        class="w-14 h-14 rounded-full bg-cover bg-center"
        style="background-image: url('/logo.jpeg');"
      ></div>
      <h1 class="uppercase text-sm font-extrabold">genbient</h1>
    </div>
    <Menu />
  </a>
  <div class="lg:w-9/12 w-full">
    <div class="relative flex items-center justify-center w-full z-10 -mb-5">
      <div
        bind:this={card}
        class="flex flex-col items-center justify-center gap-4 w-full bg-cover bg-center opacity-75"
        style="height: {cardheight}px; background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0), var(--background-color)), url('{isHome
          ? 'https://i.ibb.co/sFcsWvc/Eerie-Forest.jpg'
          : currentCategory.thumbnail}')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-12 h-12 stroke-[url(#gradient)]"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--gradient-from)" />
            <stop offset="100%" stop-color="var(--gradient-to)" />
          </linearGradient>
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7 4v16l13 -8z" />
        </svg>
        <span class="tex-center text-lg font-semibold select-none"
          >{isHome ? "Home" : currentCategory.title}</span
        >
        <span class="tex-center select-none"
          >{isHome ? "Home" : currentCategory.description}</span
        >
      </div>
      <button
        class="lg:hidden absolute top-4 right-4"
        on:click={() => {
          panelOpened = !panelOpened
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-8 h-8 stroke-[url(#gradient)]"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#2c3e50"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--gradient-from)" />
            <stop offset="100%" stop-color="var(--gradient-to)" />
          </linearGradient>
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        </svg>
      </button>
    </div>
    <ScrollableArrow class="z-0">
      {#each categories as category}
        <ScrollableArrowItem class="lg:w-64 w-32">
          <a
            href={category.slug === "all" ? "/" : `/playlist/${category.slug}`}
            class="flex flex-col items-center justify-center gap-2 w-32 pt-10 cursor-pointer touch-pan-x select-none"
          >
            <div
              class="{category.slug === data.slug ||
              (category.slug === 'all' && isHome)
                ? 'neon-shadow'
                : ''} w-20 h-20 rounded-full bg-cover bg-center opacity-75"
              style="background-image: url('{category.thumbnail}');"
            ></div>
            <span class="text-center text-sm h-10">{category.title}</span>
          </a>
        </ScrollableArrowItem>
      {/each}
    </ScrollableArrow>
    <div
      class="relative grid lg:grid-cols-4 md:grid-cols-4 grid-cols-2 p-2 gap-2 pb-16 z-10"
    >
      {#each playlist as track}
        <a
          href={`/stream/${track.slug}`}
          bind:this={card}
          class="relative flex items-center justify-center w-full rounded-md bg-cover bg-center opacity-75 cursor-pointer"
          style="height: {cardheight}px; background-image: url('{track.thumbnail}')"
        >
          <span>{track.title}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="absolute top-4 left-4 w-8 h-8 stroke-[url(#gradient)]"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="var(--gradient-from)" />
              <stop offset="100%" stop-color="var(--gradient-to)" />
            </linearGradient>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M7 4v16l13 -8z" />
          </svg>
        </a>
      {/each}
    </div>
  </div>
  <FooterPlayer {data} />
  <Tabbar class="left-0 bottom-0 fixed opacity-75 lg:hidden">
    <TabbarLink class="bg-[var(--navbar-color)]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 stroke-[var(--first-active-color)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M17 17v-13h4" />
        <path d="M13 5h-10" />
        <path d="M3 9l10 0" />
        <path d="M9 13h-6" />
      </svg>
    </TabbarLink>
    <TabbarLink class="bg-[var(--navbar-color)]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-8 h-8 stroke-[var(--first-active-color)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
        />
      </svg>
    </TabbarLink>
  </Tabbar>
</Page>

<Sidebar
  {panelOpened}
  on:close={() => {
    panelOpened = false
  }}
/>
