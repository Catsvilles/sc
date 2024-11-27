<script lang="ts">
    import { page } from '$app/stores';  
</script>
<ul class="flex flex-col items-center justify-center gap-2 text-sm">
    <li class="{$page.url.pathname.startsWith('/playlist') ? 'border-l-2 left-neon-shadow' : '' } hover:bg-[var(--navbar-color)] w-full p-1.5 px-6">
        <a href="/playlist/all" class="flex flex-row items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M14 17m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M17 17v-13h4" />
                <path d="M13 5h-10" />
                <path d="M3 9l10 0" />
                <path d="M9 13h-6" />
            </svg>
            <span>Playlist</span>
        </a>
    </li>
    <li class="{$page.url.pathname.startsWith('/favorites') ? 'border-l-2 left-neon-shadow' : '' } hover:bg-[var(--navbar-color)] w-full p-1.5 px-6">
        <a href="/favorites" class="flex flex-row items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-[var(--first-active-color)]"  viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
              </svg>
            <span>Favorites</span>
        </a>
    </li>
    <li class="{$page.url.pathname.startsWith('/recent') ? 'border-l-2 left-neon-shadow' : '' } hover:bg-[var(--navbar-color)] w-full p-1.5 px-6">
        <a href="/" class="flex flex-row items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 7v5l2 2" />
                <path d="M17 22l5 -3l-5 -3z" />
                <path d="M13.017 20.943a9 9 0 1 1 7.831 -7.292" />
            </svg>
            <span>
                Recently Played 
            </span>
        </a>
    </li>
    <li class="{$page.url.pathname.startsWith('/saved') ? 'border-l-2 left-neon-shadow' : '' } hover:bg-[var(--navbar-color)] w-full p-1.5 px-6">
        <a href="/" class="flex flex-row items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                <path d="M7 11l5 5l5 -5" />
                <path d="M12 4l0 12" />
              </svg>
            <span>
                Saved
            </span>
        </a>
    </li>
</ul>
<div class="{$page.url.pathname.startsWith('/settings') ? 'border-l-2 left-neon-shadow' : '' } absolute bottom-20 hover:bg-[var(--navbar-color)] w-full p-1.5 px-6">
    <a href="/" class="flex flex-row items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 stroke-[var(--first-active-color)]" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </svg>
        <span>Settings</span>
    </a>
</div>