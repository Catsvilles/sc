 <script lang="ts">
import player from "@app/stores/player";
import project from "@app/stores/project";

import Button from "@components/control/Button.svelte";
import Icon from "@components/Icon.svelte";

let playing: boolean = $player.playing;

function handleClick() {
    if(playing){
        $player.stop();
        playing = false;
        $player.startCursor = 0;
        $player = $player.start($project);
    } else {
        $player.startCursor = 0;
    }
    playing = $player.playing;
}
</script>

<Button 
    width={35}
    height={35}
    on:click={handleClick}>
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#f97316" viewBox="0 0 24 24">
        <path d="M9.5 12l7.5-4.5v9l-7.5-4.5zm-4.5 0l6.5 4v-1.634l-3.943-2.366 3.943-2.366v-1.634l-6.5 4zm17 0c0 5.514-4.486 10-10 10s-10-4.486-10-10 4.486-10 10-10 10 4.486 10 10zm-22 0c0 6.627 5.373 12 12 12s12-5.373 12-12-5.373-12-12-12-12 5.373-12 12z"/>
    </svg>
</Button>
  