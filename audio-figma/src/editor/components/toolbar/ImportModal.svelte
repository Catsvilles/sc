<script lang="ts">
import project from "@app/stores/project";  
import { renderNewProject } from "@app/utils/ProjectMap";  
import stack from "@app/stores/undoredo";

export let hideModal;
export let actionTitle = 'Import Project';

function closeModal() {
    hideModal = true;
}

let fileInput
let files;

function importProject() {
    const reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = async function() {
      var data = JSON.parse(reader.result);
      $project.tracks = [];
      renderNewProject(data);
      const np = structuredClone($project);
      $stack.push(np);
      hideModal = true;
    };
}

</script>

<div class="z-50 fixed flex items-center justify-center w-full h-full top-0 left-0">
    <div on:pointerdown={closeModal} class="absolute glassmorphism w-full h-full bg-cover bg-opacity-75 blur-sm"></div>
    <div class="flex flex-col gap-4 w-full md:w-6/12 h-3/6 shadow-lg z-50 rounded-lg font-semibold p-4">
        <div class="flex justify-end items-center">
            <div on:pointerdown={closeModal} class="cursor-pointer z-50">
                <svg class="fill-current text-neutral-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18">
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
            </div>
        </div>
        <div class="flex justify-center text-2xl text-center text-orange-500 mb-6 uppercase">{actionTitle}</div>
        <div class="flex flex-col justify-center items-center gap-10 m-4">
            <form on:submit|preventDefault>
                <button on:pointerdown={() => fileInput.click()} class="flex items-center w-full mx-auto uppercase px-6 rounded-md cursor-pointer bg-[#262626] border border-orange-500">
                    <div class="rounded py-2 px-4">
                        <p class="text-lg text-orange-500">Select a File</p>
                        <input hidden type="file" bind:this={fileInput} on:change="{importProject}" accept="video/*"/>         
                    </div>
                </button>
            </form>
        </div>
    </div>
</div>