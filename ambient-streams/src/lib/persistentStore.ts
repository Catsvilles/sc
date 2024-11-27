import { persist, createLocalStorage, createIndexedDBStorage } from "@macfja/svelte-persistent-store";
import { writable } from "svelte/store";

export let cachedFavorites = persist(writable({}), createIndexedDBStorage(), "favorites");