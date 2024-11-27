<script lang="ts">
  import Button from "@components/control/Button.svelte";
  import player from "@app/stores/player";

  async function startRecording() {
    $player.isRecording = true;
  }

  async function stopRecording() {
    $player.isRecording = false;
  }
</script>


{#if $player.isRecording}
<Button 
width={35}
height={35}
on:click={stopRecording}>
    <div class="p-1.5 shadow-sm bg-red-500 w-px h-px rounded-full animate-pulse"></div>
</Button>
{:else}
<Button 
width={35}
height={35}
on:click={startRecording}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="gray" width="30" height="30" viewBox="0 0 24 24">
        <path d="M16 11c0 2.209-1.791 4-4 4s-4-1.791-4-4v-7c0-2.209 1.791-4 4-4s4 1.791 4 4v7zm4-2v2c0 4.418-3.582 8-8 8s-8-3.582-8-8v-2h2v2c0 3.309 2.691 6 6 6s6-2.691 6-6v-2h2zm-7 13v-2h-2v2h-4v2h10v-2h-4z"/>
    </svg>
</Button>
{/if}