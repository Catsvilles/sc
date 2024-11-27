<script lang="ts">
  import player from "@app/stores/player";
  import project from "@app/stores/project";
	import vimePlayerStore from "@app/stores/playpausevime";
  import Button from "@components/control/Button.svelte";
  import Icon from "@components/Icon.svelte";

  let playing: boolean = $player.playing;

  $: icon = $player.playing ? "media/pause" : "media/play";

  function handleClick() {
    playing = $player.playing;
    if ($player.loop && !playing) {
    $player = $player.start($project, $player.loopingPoints[0], $player.loopingPoints[1]);
    } else {
    $player = $player.toggle($project);
    }
    
    $player.startCursor = $player.currentTime;    
    if (playing) {
      $vimePlayerStore?.play();
    } else {
      $vimePlayerStore?.pause();
    }
  }
</script>

<Button on:click={handleClick}
  width={35}
  height={35}
>
  <Icon
    color="#f97316"
    size="40"
    name={icon}
    preload={["media/pause_circle_filled", "media/play_circle_outline"]}
  />
</Button>
