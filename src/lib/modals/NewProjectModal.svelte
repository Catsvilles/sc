<script lang="ts">
  import { goto } from '$app/navigation';
  import { v4 as uuidv4 } from 'uuid';
  import { createEventDispatcher } from 'svelte';

  export let supabaseClient
  export let user_id;
  export let hideModal = false;

  const dispatch = createEventDispatcher();

  let is_private = false;

	const submitProject = async (e: SubmitEvent) => {
		const title = e.target.elements.title.value;
    const description = e.target.elements.description.value;
    const project_id = uuidv4();

		let { error } = await supabaseClient
		.from("projects")
		.insert({title, project_id, description, is_private, user_id})
		.select()
		if (error) {
			console.log("error", error);
		} else {
      hideModal = true;
      const url = `studio/${project_id}`;
      goto(url);
		}
	};

  function keydown(event: KeyboardEvent) {
    event.stopImmediatePropagation(); 
    event.stopPropagation(); 
  }

  function closeModal(){
    hideModal = !hideModal;
    dispatch('close');
  };
</script>

<div class="fixed flex items-center justify-center w-full h-full top-0 left-0 z-50">
  <div on:pointerdown="{closeModal}" class="absolute glassmorphism w-full h-full bg-cover bg-opacity-75 blur-sm"></div>
  <div class="flex flex-col gap-4 w-full md:w-6/12 h-min shadow-lg z-50 rounded-lg font-semibold p-4">
    <div class="flex justify-end items-center">
      <div on:pointerdown="{closeModal}" class="cursor-pointer z-50">
        <svg class="fill-current text-neutral-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18">
          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
        </svg>
      </div>
    </div>
    <div class="flex justify-center text-2xl text-center text-orange-500 uppercase">
      New Project
    </div>
    <div class="flex flex-col justify-center items-center m-4">
      <form on:submit|preventDefault={submitProject}>
        <div class="flex items-center justify-center flex-col gap-2">
          <input on:keydown={keydown} name="title" class="regularfont bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-700" placeholder="Project title" required>
          <input on:keydown={keydown} name="description" class="regularfont bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-700" placeholder="Project description">  
          <label for="default-toggle" class="relative inline-flex items-center cursor-pointer mt-2">
            <input type="checkbox" bind:checked={is_private} id="default-toggle" class="sr-only peer">
            <div class="w-11 h-6 bg-gray-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
            <span class="ml-3 text-md text-neutral-300 font font-semibold">Private</span>
          </label>
          <button type="submit" class="flex items-center justify-center w-full text-orange-500 p-2 mx-auto bg-[#262626] uppercase px-6 rounded-md cursor-pointer border border-orange-500">
            <p>Create</p>
          </button>  
        </div>    
      </form>       
    </div>
  </div>
</div>


