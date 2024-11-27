<script lang="ts">
  import { sortedBlogPosts, blogInfo } from "$lib/posts"
</script>

<svelte:head>
  <title>{blogInfo.name}</title>
  <meta name="description" content="{blogInfo.description}" />
</svelte:head>

<div class="py-8 lg:py-12 px-6 max-w-lg mx-auto h-full">
  <div
    class="text-3xl lg:text-5xl font-medium text-[gray] flex gap-3 items-baseline text-center place-content-center"
  >
    <div
      class="text-center leading-relaxed font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
    >
      {blogInfo.name}
    </div>
    <a href="/blog/rss.xml" target="_blank" rel="noreferrer">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12.75 19.5v-.75a7.5 7.5 0 0 0-7.5-7.5H4.5m0-6.75h.75c7.87 0 14.25 6.38 14.25 14.25v.75M6 18.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
      </svg>      
    </a>
  </div>
  <div class="text-4xl text-[gray] font-neon text-center">Atmoscapes Blog</div>

  {#each sortedBlogPosts as post}
    <a href={post.link}>
      <div class="card my-6 shadow-xl flex-row overflow-hidden">
        <div class="flex-none w-6 md:w-32 bg-secondary"></div>
        <div class="py-6 px-6">
          <div class="lg:text-2xl text-xl uppercase text-[gray] font-neon">{post.title}</div>
          <div class="text-sm text-[gray] font-neon">
            {post.parsedDate?.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div class="text-slate-200">{post.description}</div>
        </div>
      </div>
    </a>
  {/each}
</div>
