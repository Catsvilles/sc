<script lang="ts">
  import { page } from "$app/stores"
</script>

<ul class="flex flex-col items-center justify-center gap-2 text-sm">
  <li
    class="{$page.url.pathname.startsWith('/playlist') ||
    $page.url.pathname === '/'
      ? 'border-l-2 left-neon-shadow'
      : ''} hover:bg-[var(--navbar-color)] w-full p-1.5 px-6"
  >
    <a href="/" class="flex flex-row items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 stroke-[var(--first-active-color)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
        <path d="M10 12h4v4h-4z" />
      </svg>
      <span>Home</span>
    </a>
  </li>
  <li
    class="{$page.url.pathname.startsWith('/favorites')
      ? 'border-l-2 left-neon-shadow'
      : ''} hover:bg-[var(--navbar-color)] w-full p-1.5 px-6"
  >
    <a
      data-sveltekit-preload-data
      href="/favorites"
      class="flex flex-row items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 stroke-[var(--first-active-color)]"
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
      <span>Favorites</span>
    </a>
  </li>
  <li
    class="{$page.url.pathname.startsWith('/recent')
      ? 'border-l-2 left-neon-shadow'
      : ''} hover:bg-[var(--navbar-color)] w-full p-1.5 px-6"
  >
    <a href="/" class="flex flex-row items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 stroke-[var(--first-active-color)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M12 7v5l2 2" />
        <path d="M17 22l5 -3l-5 -3z" />
        <path d="M13.017 20.943a9 9 0 1 1 7.831 -7.292" />
      </svg>
      <span> Recently Played </span>
    </a>
  </li>
  <li
    class="{$page.url.pathname.startsWith('/saved')
      ? 'border-l-2 left-neon-shadow'
      : ''} hover:bg-[var(--navbar-color)] w-full p-1.5 px-6"
  >
    <a href="/" class="flex flex-row items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 stroke-[var(--first-active-color)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        <path d="M7 11l5 5l5 -5" />
        <path d="M12 4l0 12" />
      </svg>
      <span>Saved</span>
    </a>
  </li>
  <li class="hover:bg-[var(--navbar-color)] w-full p-1.5 px-6">
    <a href="/pricing" class="flex flex-row items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 stroke-[var(--first-active-color)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
        <path
          d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z"
        />
      </svg>
      <span>Pricing</span>
    </a>
  </li>
  <li class="hover:bg-[var(--navbar-color)] w-full p-1.5 px-6">
    <a href="/blog" class="flex flex-row items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 stroke-[var(--first-active-color)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0v-13a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11"
        />
        <path d="M8 8l4 0" />
        <path d="M8 12l4 0" />
        <path d="M8 16l4 0" />
      </svg>
      <span>Blog</span>
    </a>
  </li>
  <li class="hover:bg-[var(--navbar-color)] w-full p-1.5 px-6">
    <a href="/about" class="flex flex-row items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 stroke-[var(--first-active-color)]"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#2c3e50"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
        <path d="M12 9h.01" />
        <path d="M11 12h1v4h1" />
      </svg>
      <span>About</span>
    </a>
  </li>
</ul>
<div
  class="{$page.url.pathname.startsWith('/account/settings')
    ? 'border-l-2 left-neon-shadow'
    : ''} absolute bottom-20 hover:bg-[var(--navbar-color)] w-full p-1.5 px-6"
>
  <a href="/account/settings" class="flex flex-row items-center gap-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="w-6 h-6 stroke-[var(--first-active-color)]"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="#2c3e50"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"
      />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    </svg>
    <span>Settings</span>
  </a>
</div>
