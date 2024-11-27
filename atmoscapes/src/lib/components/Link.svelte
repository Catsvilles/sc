<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
    export let path: string;
    export let content: string;
    export let external: boolean = false;
</script>

{#if external === true}
    <a href={path} class="flex items-center icon-color menu-text transform hover:translate-x-4" target="_blank">
        <span>{content}</span>
        <Icon name={"triangle-left"} styles={"w-8 h-8"}/>
    </a>
{:else}
    <a href={path} class="flex items-center icon-color menu-text transform hover:translate-x-4">
        <span>{content}</span>
        <Icon name={"triangle-left"} styles={"w-8 h-8"}/>
    </a>
{/if}