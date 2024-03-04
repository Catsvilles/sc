import { writable, get } from "svelte/store";
import { onDestroy } from 'svelte';

export default function (eventName = "input", message = "You have unsaved changes. Are you sure you want to leave?") {
  const store = writable(false);
    function checkNavigation(e) {
      if (get(store)) {
        if (!confirm(message)) {
          e.preventDefault();
          if (e.type === "beforeunload") {
            e.returnValue = "";
          }
        }
      }
    }
    for (let a of document.querySelectorAll("a[href]")) {
      a.addEventListener("click", checkNavigation);
    }
    window.addEventListener("beforeunload", checkNavigation);

    onDestroy(() => {
        for (let a of document.querySelectorAll("a[href]")) {
            a.removeEventListener("click", checkNavigation);
          }
          window.removeEventListener("beforeunload", checkNavigation);
    });
  
  return { store };
}
