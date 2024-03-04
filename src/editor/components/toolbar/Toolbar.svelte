<script lang="ts">
  import Icon from "@components/Icon.svelte";
  import Button from "@components/control/Button.svelte";
  import TempoInput from "./TempoInput.svelte";
  import RecordButton from "./RecordButton.svelte";
  import RewindButton from "./RewindButton.svelte";
  import PlayButton from "./PlayButton.svelte";
  import Metronome from "./Metronome.svelte";
  import HelpButton from "./HelpButton.svelte";
  import project from "@app/stores/project";
  import RenderButton from "./RenderButton.svelte";
  import stack from "@app/stores/undoredo";
  import { renderNewURProject } from "@app/utils/ProjectMap";  

  let ImportModal;
  let modalProps = {};
  let hideModal = false;

  $: if (hideModal) {
    ImportModal = null;
  }

  const importModal = () => {
      hideModal = false;
      import('./ImportModal.svelte').then(res => ImportModal = res.default);
      modalProps = {hideModal: hideModal};
  };
</script>
<svelte:component this={ImportModal} bind:hideModal {...modalProps}/>

<nav class="flex flex-row items-center justify-between w-full h-14 bg-[#333333] rounded-t-md">
  <div class="flex gap-1 mx-1">
    <Button width={25} height={25} on:click={importModal}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="gray" viewBox="0 0 24 24" stroke="gray" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </Button>
    <Button width={24} height={24} disabled={$stack.first}
      on:click={() => project.update((project) => {
        const data = $stack.undo();
        project.tracks = [];
        renderNewURProject(data);
        return project;
      })}> 
      <Icon 
      color="gray"
      size="24"
      name="arrow/circle_chevron_left" />
    </Button>
    <Button width={24} height={24} disabled={$stack.last}
      on:click={() => project.update((project) => {
        const data = $stack.redo();
        project.tracks = [];
        renderNewURProject(data);
        return project;})}>
      <Icon
      color="gray" 
      size="24"
      name="arrow/circle_chevron_right" />
    </Button>
    <TempoInput bind:value={$project.tempo} />
  </div>
  <div class="flex flex-row gap-4">
    <RecordButton />
    <RewindButton />
    <PlayButton />
    <Metronome />
  </div>
  <div class="flex gap-2 mx-1">
    <RenderButton/>
    <HelpButton />
  </div>
</nav>
