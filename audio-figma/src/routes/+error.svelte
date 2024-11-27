<style>
h1 {
	font-size: 150px;
	line-height: 150px;
	font-weight: 700;
	color: #252932;
	text-shadow: rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px,
		rgba(61, 61, 61, 0.3) 3px 3px;
}
</style>

<script>
import { page } from '$app/stores'
import Footer from '$lib/Footer.svelte'
</script>

<div class="h-full">
	<div class="flex h-screen flex-col items-center justify-center text-center">
		{#if $page.error?.status === 404}
			<div class="container">
				<div class="layout">
					<div class="flex flex-col items-center justify-center text-center">
						<h1>404</h1>
						<h2 class="headline my-3">Sorry, page not found</h2>
					</div>
				</div>
			</div>
		{:else if $page.error?.status === 403}
			<div class="container">
				<div class="layout">
					<div class="text-center">
						<h1>403</h1>

						<h2 class="headline my-3">Sorry, access denied.</h2>
					</div>
				</div>
			</div>
		{:else if $page.error?.status === 500}
			<div class="container">
				<div class="layout">
					<div class="flex flex-col gap-5 text-center">
						<h1>500</h1>

						<h2 class="headline my-3">{$page.error?.message || 'Sorry, the server is down.'}</h2>
					</div>
				</div>
			</div>
		{:else}
			<div class="container">
				<div class="layout">
					<div class="flex flex-col gap-5 text-center">
						<h1>{$page.error?.status || 500}</h1>

						<h2 class="headline my-3">{$page.error?.message}</h2>
					</div>
				</div>
			</div>
		{/if}

		<div class="mt-5 sm:mt-10">
            <a href="/" class="mt-4 block rounded px-4 py-2 text-center text-sm font-thin text-gray-700">
                Go Home
            </a>
		</div>
	</div>

	<div class="hidden sm:block">
		<Footer />
	</div>
</div>