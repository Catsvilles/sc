<script lang="ts">
    import {hideModal}  from "../../stores/vimestore";
	export let onFile: (file: File) => void;
	export let input;
	let temp_input: string;
	let fileInput: HTMLInputElement;

	const isDraggingFiles = (event: DragEvent) =>
		event.dataTransfer?.types?.some((type) => type.toLowerCase() === 'files');

	const preventFileDefault = (event: DragEvent) => {
		if (isDraggingFiles(event)) event.preventDefault();
	};

	const getFirstFile = (fileList: FileList | null | undefined) => {
		if (!fileList) return null;
		if (!fileList.length) return null;
		return fileList[0];
	};

	const onDrop = (event: DragEvent) => {
		if (!isDraggingFiles(event)) return;
		event.preventDefault();
		const file = getFirstFile(event.dataTransfer?.files);
		if (file) onFile(file);
	};

	const onFileInputChange = () => {
		const file = getFirstFile(fileInput?.files);
		if (file) onFile(file);
	};

    const submit = () => {
	    input = temp_input;
	    temp_input = '';
    };

	let actionTitle = 'Video Select';

	function reset() {
        $hideModal = false;
    }
</script>

{#if $hideModal === true }
	<div class="z-50 fixed flex items-center justify-center w-full h-full top-0 left-0">
		<div on:pointerdown="{reset}" class="absolute glassmorphism w-full h-full bg-cover bg-opacity-75 blur-sm"></div>
		<div class="flex flex-col gap-4 w-full md:w-6/12 h-min shadow-lg z-50 rounded-lg font-semibold p-4">
			<div class="flex justify-end items-center">
				<div on:pointerdown="{reset}" class="cursor-pointer z-50">
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
							<input hidden type="file" bind:this={fileInput} on:change={onFileInputChange} accept="video/*"/>         
						</div>
					</button>
				</form>
				<div class="flex w-full">
					<input type="url"
						class="input text-sm rounded-l-lg w-full text-center"
						placeholder="A LINK TO YOUTUBE, VIMEO OR DAILYMOTION VIDEO"
						bind:value={temp_input}
					/>
					<button class="uppercase px-4 py-2 text-white bg-orange-500 text-xs cursor-pointer hover:animate-pulse rounded-r-lg" on:pointerdown={submit}>
						Submit
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- <svelte:window on:drop={onDrop} on:dragover={preventFileDefault} on:dragenter={preventFileDefault}/> -->



