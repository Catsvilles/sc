<script lang="ts">
  import { Navbar, Tabbar, TabbarLink, Link, Panel, Page } from "konsta/svelte"
  import Menu from "$lib/components/Menu.svelte"
  import { createEventDispatcher } from "svelte"
  const dispatch = createEventDispatcher()

  export let panelOpened: boolean
</script>

<Panel
  side="left"
  opened={panelOpened}
  onBackdropClick={() => {
    panelOpened = false
    dispatch("close")
  }}
>
  <Page>
    <Navbar>
      <Link slot="left" navbar>
        <div class="flex flex-row items-center justify-center gap-2 py-4">
          <div
            class="w-10 h-10 rounded-full bg-cover bg-center"
            style="background-image: url('/logo.jpeg');"
          ></div>
          <h1 class="uppercase text-sm font-extrabold">genbient</h1>
        </div>
      </Link>
      <Link
        slot="right"
        navbar
        onClick={() => {
          panelOpened = false
          dispatch("close")
        }}
      >
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
          <path d="M18 6l-12 12" />
          <path d="M6 6l12 12" />
        </svg>
      </Link>
    </Navbar>
    <Menu />
  </Page>
</Panel>
