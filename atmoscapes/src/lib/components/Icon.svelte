<script lang="ts">
    import { icons } from "$lib/svg";
    export let name: string;
    export let styles: string

    let selectedIcon = icons.find(icon => icon.name === name);

</script>

{#if selectedIcon}
    <svg xmlns="http://www.w3.org/2000/svg" class={styles} viewBox="0 0 24 24" style={selectedIcon.style}>
        <path d={selectedIcon.path}/>
    </svg>
{/if}
