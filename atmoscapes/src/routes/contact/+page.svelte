<script lang="ts">
	import type { ActionData } from './$types';
	export let form: ActionData;
    import Link from "$lib/components/Link.svelte";
    
    let submissionTime = Date.now();
</script>
<section class="flex flex-col relative gap-12 items-center justify-center w-full py-24">
    <div class="absolute w-full h-full bg-[url('contact.jpg')] bg-center bg-cover bg-fixed grayscale"></div>
    <div class="absolute z-10 inset-0 w-full h-full bg-black opacity-75"></div>
    <h1 class="lg:text-6xl text-5xl uppercase text-[gray] font-neon z-20 grayscale-0">
        Contact Atmoscapes
	</h1>
    <div class="flex flex-col lg:flex-row items-center justify-center w-full z-20">
		<form method="POST" class="flex flex-col items-center gap-2 w-full lg:w-6/12 text-white">
			<div class="flex flex-col items-center justify-center gap-2">
				<p class="uppercase text-sm lg:text-lg">Let's create that new FL Studio you've always dreamed of.</p>
			</div>
			<div class="flex flex-col items-center justify-center gap-4 w-full p-4 text-sm">
				<input 
					type="hidden" 
					name="submissionTime" 
					value={submissionTime}
				/>

				<input 
					type="text" 
					name="website" 
					class="hidden" 
					tabindex="-1" 
					autocomplete="off"
				/>
				<input 
					type="hidden" 
					name="submissionTime" 
					bind:value={submissionTime}
				/>
				<input type="text" name="name" required placeholder="Your Name" class="w-full p-2.5 primary-bg-color outline-0 border-2 border-[#41414e] focus:border-2 focus:border-orange-800">
				<input type="email" name="email" required placeholder="Your Email" class="w-full p-2.5 primary-bg-color outline-0 border-2 border-[#41414e] focus:border-2 focus:border-orange-800">
				<textarea name="message" rows="4" required placeholder="Your Message" class="w-full p-2.5 primary-bg-color outline-0 border-2 border-[#41414e] focus:border-2 focus:border-orange-800"></textarea>
			</div>
			<button type="submit" class="py-4 px-8 bg-orange-600 hover:bg-gray-500 transition duration-1000 text-white uppercase text-sm mx-auto vhs">
				Submit
			</button>
		</form>
    </div>
</section>
<div 
	role="presentation"
	class="{form?.success ? "block" : "hidden" } fixed flex items-center justify-center top-0 w-full h-full z-40">
	<div class="absolute bg-black opacity-90 w-full h-full"></div>
	<div class="flex flex-col gap-4 items-center justify-center w-full text-white text-md uppercase text-center h-4 z-50">
		{#if form?.success === true}
			<p>Message sent successfully</p>
			<Link path={'/'} content={'Go Home'}/>
		{:else}
			<p>Failed to send message</p>
			<Link path={'/'} content={'Go Home'}/>
		{/if}
	</div>
</div>

