<script lang="ts">
  import { page } from "$app/stores"
  import { error } from "@sveltejs/kit"
  import { sortedBlogPosts, type BlogPost } from "$lib/posts"

  let currentPost: BlogPost | null = null
  for (const post of sortedBlogPosts) {
    if (
      $page.url.pathname == post.link ||
      $page.url.pathname == post.link + "/"
    ) {
      currentPost = post
      continue
    }
  }
  if (!currentPost) {
    error(404, "Blog post not found");
  }

  const pageTitle = currentPost?.title ? currentPost.title : "Not Found"
  const pageDescription = currentPost?.description
    ? currentPost.description
    : "Blog post"
  const pageUrl = $page.url.origin + $page.url.pathname
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={pageDescription} />

  <!-- Facebook -->
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={pageDescription} />
  <meta property="og:site_name" content={"Atmoscapes"} />
  <meta property="og:url" content={pageUrl} />
  <!-- <meta property="og:image" content="https://samplesite.com/image.jpg"> -->

  <!-- Twitter -->
  <!-- “summary”, “summary_large_image”, “app”, or “player” -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={pageDescription} />
  <!-- <meta name="twitter:site" content="@samplesite"> -->
  <!-- <meta name="twitter:image" content="https://samplesite.com/image.jpg"> -->
</svelte:head>

<article class="prose dark:prose-invert mx-auto py-12 px-6 font-sans">
  {#if currentPost == null}
    <h1>Blog post not found</h1>
  {:else}
    <div class="text-sm text-accent">
      {currentPost.parsedDate?.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })}
    </div>
    <h1 class="lg:text-5xl text-4xl uppercase text-[gray] font-neon">{currentPost.title}</h1>
    <slot />
  {/if}
  <div class="absolute w-96 h-24 rounded-full bg-gradient-to-r from-orange-800 to-pink-600 -rotate-45 blur-3xl"></div>
  <div class="absolute top-10 right-10 w-24 h-20 rounded-full bg-gradient-to-r from-orange-800 to-pink-600 rotate-45 blur-3xl"></div>
  <div class="absolute top-10 right-44 w-24 h-20 rounded-full bg-gradient-to-r from-orange-800 to-pink-600 rotate-45 blur-3xl"></div>
  <div class="w-20 h-24 rounded-full bg-gradient-to-r from-orange-500 to-red-700 -rotate-45 blur-3xl"></div>
  <div class="absolute bottom-10 left-10 w-72 h-24 rounded-full bg-gradient-to-r from-orange-700 to-red-700 -rotate-45 blur-3xl"></div>
  <div class="absolute top-24 left-44 w-24 h-24 rounded-full bg-gradient-to-r from-orange-800 to-red-500 blur-3xl"></div>
  <div class="absolute bottom-24 right-44 w-24 h-40 rounded-full rotate-45 bg-gradient-to-r from-orange-800 to-red-500 blur-3xl"></div>
</article>
