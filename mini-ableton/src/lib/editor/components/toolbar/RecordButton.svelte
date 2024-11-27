<script lang="ts">
  import player from "$lib/editor/stores/player";

  async function startRecording() {
    $player.isRecording = true;
  }

  async function stopRecording() {
    $player.isRecording = false;
  }
</script>

{#if $player.isRecording}
  <button on:click={stopRecording} class="p-2 second-bg-color rounded-lg">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon-fill-active w-3 h-3">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/>
    </svg>
  </button>
{:else}
  <button on:click={startRecording} class="p-2 second-bg-color rounded-lg">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="icon-fill-inactive w-3 h-3">
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z"/>
    </svg>
  </button>
{/if}




  

  
