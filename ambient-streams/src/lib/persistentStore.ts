import { persist, createLocalStorage, createIndexedDBStorage } from "@macfja/svelte-persistent-store"
import { writable } from "svelte/store"

// export let favorites = persist(writable([]), createLocalStorage(), "favorites");

// export let favorites = persist(writable({ clips: [] }), createIndexedDBStorage(), "favorites")

export let cachedFavorites = persist(writable({}), createIndexedDBStorage(), "favorites");