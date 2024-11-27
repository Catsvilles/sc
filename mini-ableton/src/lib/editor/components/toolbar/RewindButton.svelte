 <script lang="ts">
import player from "$lib/editor/stores/player";
import project from "$lib/editor/stores/project";

import Button from "$lib/editor/components/control/Button.svelte";
import Icon from "$lib/editor/components/Icon.svelte";

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

<Button on:click={handleClick}>
    <Icon name="media/skip_previous" />
</Button>
  