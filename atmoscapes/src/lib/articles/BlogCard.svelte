<script lang="ts">
    import Icon from "$lib/components/Icon.svelte";
	export let author: string;
	export let date: string;
    export let description: string;
	export let title: string;
	export let slug = '';
	export let image = ''

	const formattedDate = new Date(date).toDateString();

	const id = title
		.toLowerCase()
		.replace(/[^a-zA-Z ]/g, '')
		.replace(/\s/g, '-');

	const href = slug && `/blog/${slug}`;

	let randomHeight : number = Math.floor(Math.random() * (600 - 176 + 1)) + 176;
</script>
<article class="prose lg:prose-xl">

<div class="relative flex flex-col items-center justify-center mb-4 lg:w-72 w-full h-96" style="height: {384}px">
	<span class="absolute z-20 top-0 left-0 px-4 py-2 bg-red-800 text-xs text-white font-medium uppercase">
		{formattedDate}
	</span>
	<div class="absolute z-10 inset-0 bg-black opacity-60"></div>
	<img class="w-full h-full object-cover" src={image} alt="">
	<div class="absolute z-20 bottom-0 uppercase p-4 bg-white opacity-50 w-full group">
		<!-- <span class="text-sm">{category}</span> -->
		{#if slug}
			<h2 class="text-lg uppercase" class:large={!slug} {id}>
				<a href={href}>
					{title}
				</a>
			</h2>
		{/if}
		<a href={href} class="flex items-center transition duration-1000 text-sm group-hover:text-red-800 font-medium uppercase transform group-hover:translate-x-4 group-hover:fill-red-800 fill-[#6d6c6c]">
			<span>Read more</span>
			<Icon name={"triangle-left"} styles={"w-8 h-8"}/>
		</a>
	</div>
</div>

</article>

