<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let supabaseClient

    const dispatch = createEventDispatcher();

    export let title: string;
    export let description: string;
    export let is_private: boolean;
    export let id: number;
    export let hideModal = false;

    const editProject = async (e: SubmitEvent) => {
        // const updated_at = new Date();
        let { error } = await supabaseClient
        .from("projects")
        .update({title, description, is_private })
        .eq("id", id)
        .select()
        .single()
        if (error) {
            console.log("error", error);
        }
        dispatch('edit');
        dispatch('close');
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

<div class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center">
    <div on:pointerdown={closeModal} class="absolute w-full h-full bg-gray-400 bg-opacity-75"></div>
        <div class="bg-[#333333] w-11/12 md:max-w-md mx-auto shadow-lg z-50 overflow-y-auto pb-4 rounded-lg">
        <div class="modal-content py-4 text-center px-6 text-neutral-300 font-semibold font">
            <div class="flex justify-end items-center pb-3">
                <div on:pointerdown={closeModal} class="cursor-pointer z-50">
                <svg class="fill-current text-neutral-300" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
                </div>
            </div>
            <div class="flex justify-center text-2xl text-center mb-8 uppercase">
                Edit Project
            </div>
            <form on:submit|preventDefault={editProject}>
                <div class="flex items-center justify-center flex-col gap-2">
                    <input on:keydown={keydown} bind:value={title} name="title" class="regularfont bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-700" placeholder="Project title" required>
                    <textarea on:keydown={keydown} bind:value={description} name="description" class="regularfont bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-orange-700" placeholder="Project description" required></textarea>
                    <label for="default-toggle" class="relative inline-flex items-center cursor-pointer mt-6">
                        <input type="checkbox" bind:value={is_private} bind:checked={is_private} id="default-toggle" class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                        <span class="ml-3 text-md text-neutral-300 font font-semibold">Private</span>
                    </label>
                </div>
                <button type="submit" class="m-2 w-40 uppercase rounded-full border-2 border-orange-500 px-5 py-3 text-center text-sm font-medium text-white shadow-md shadow-orange-900 hover:bg-orange-700 mt-4">
                    Edit
                </button>      
            </form>         
        </div>
    </div>
</div>

  