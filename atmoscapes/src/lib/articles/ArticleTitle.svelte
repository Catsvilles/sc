<script lang="ts">
	export let slug = '';
	export let title: string;

	const id = title
		.toLowerCase()
		.replace(/[^a-zA-Z ]/g, '')
		.replace(/\s/g, '-');

	const href = slug ? `/blogposts/${slug}` : '#' + id;
</script>

{#if slug}
	<h3 class="text-white uppercase text-center" class:large={!slug} {id}>
		<a {href}>
			{title}
		</a>
	</h3>
{:else}
	<h2 class="text-white uppercase" class:large={!slug} {id}>
		<a {href}>
			{title}
		</a>
	</h2>
{/if}
