<script lang="ts">
import { HOST } from './../config'
export let title = '';
export let description = '';
export let keywords = '';
export let type = 'website';
export let url = '';
url = HOST + url;
export let image = '';
image = HOST + image;
export let card = 'summary_large_image';
export let song = '';
</script>
<svelte:head>
    <title>{title}</title>
    <meta name="description" content="{description}" />
    {#if keywords}
      <meta name="keywords" content="{keywords}"/>
    {/if}
    <link rel="canonical" href="{url}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="{type}">
    <meta property="og:url" content="{url}">
    <meta property="og:title" content="{title}">
    <meta property="og:description" content="{description}">
    {#if image}
        <meta property="og:image" content="{image}">
    {/if}

    <!-- Twitter -->
    <meta property="twitter:card" content="{card}">
    <meta name="twitter:site" content="@ soundgrape">
    <meta property="twitter:url" content="{url}">
    <meta property="twitter:title" content="{title}">
    <meta property="twitter:description" content="{description}">
    {#if image}
        <meta property="twitter:image" content="{image}">
    {/if}

    {#if song.url}
    <meta property="og:audio" content="{HOST+song.url}" />
    <meta property="og:audio:title" content="{song.title}" />
    <meta property="og:audio:artist" content=" soundgrape" />
    <meta property="og:audio:album" content="Royalty Free Music" />
    <meta property="og:audio:type" content="audio/mpeg" />
    {/if}
</svelte:head>
