<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Icon from "@components/Icon.svelte";
    import NewProjectModal from '$lib/modals/NewProjectModal.svelte';
    import EditProjectModal from '$lib/modals/EditProjectModal.svelte';

    export let supabaseClient;
    export let user_id;

    let projects = [];
    let newProject = false;
    let editProject = false;
    let editingId: number;

    function enterEditingState(id: number) {
		editingId = id;
		editProject = true;
  	};

    const fetchProjects = async () => {
		let { data, error } = await supabaseClient
            .from("projects")
            .select("*")
		if (error) {
			console.log("error", error);
		} 
		else {
			projects = data.filter((project) => project.user_id == user_id);
		}
	};

	onMount(async () => {
		fetchProjects();
	});

	const deleteProject = async (id:number) => {
        if (confirm("Are you sure you want to delete this project?")) {
            try {
                await supabaseClient
                .from("projects")
                .delete()
                .eq("id", id)
            }
            catch (error) {
                console.log("error", error);
            }
            fetchProjects();
        }
	};

    function goToProjectUrl(project_id){
        const url = `studio/${project_id}`;
        goto(url);
    }
</script>

<div class="flex flex-col gap-2 bg-[#333333] p-4 rounded-md">
    <button on:pointerdown= {()=>{newProject = true}}
        class="flex items-center justify-start gap-2 py-2 px-4 shadow rounded-lg bg-[#262626] text-xs text-[gray] cursor-pointer w-full mb-1">
        <Icon
        name={"edit/plus_circle_outline"}
        size="1.5em"
        color="gray"
        />
        <span class="">Create project</span>
    </button>
    <!-- <button class="flex items-center justify-between p-4 shadow rounded bg-[#1f2430] text-sm font-medium text-white cursor-pointer w-full mb-1">
        <Icon
        name={"file/file_new"}
        size="1.2em"
        color="white"
        />
        <span class="-mb-1 text-white font">Import project</span>
    </button>
    <button class="flex items-center justify-between p-4 shadow rounded bg-[#1f2430] text-sm font-medium text-white cursor-pointer w-full mb-1">
        <svg clip-rule="evenodd" class="w-5 h-5" fill="white" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="m16.843 10.211c.108-.141.157-.3.157-.456 0-.389-.306-.755-.749-.755h-8.501c-.445 0-.75.367-.75.755 0 .157.05.316.159.457 1.203 1.554 3.252 4.199 4.258 5.498.142.184.36.29.592.29.23 0 .449-.107.591-.291 1.002-1.299 3.044-3.945 4.243-5.498z"/>
        </svg>
        <span class="-mb-1 text-white font">Your projects</span>
    </button> -->
    {#each projects as project (project.id)}
        <div class="flex items-center gap-2 px-1 py-3 bg-[#262626] rounded-md w-full">
            <div class="flex flex-col gap-2 w-full truncate text-neutral-300 text-xs mx-2">
                <div class="flex flex-row justify-between">
                    <p on:pointerdown={()=>{goToProjectUrl(project.project_id)}} class="uppercase font text-sm cursor-pointer hover:underline">
                        {project.title}
                    </p>
                </div>
                <p>{project.description}</p>
                <!-- <p class="text-xs">{project.created_at}</p> -->
                {#if project.is_private === true}
                    <p class="flex items-center justify-center gap-2 bg-[#262626] rounded-full w-min px-4 border border-orange-500">Private</p>
                {/if}
            </div>
            <div on:pointerdown={()=>{enterEditingState(project.id)}} class="flex items-center justify-center cursor-pointer p-1 rounded-full transform transition hover:scale-110 duration-300 mr-1">
                <Icon
                name={'edit/edit'}
                size="1em"
                color="white"
                />
            </div>
            <div on:pointerdown={()=>{deleteProject(project.id)}} class="flex items-center justify-center cursor-pointer p-1 rounded-full transform transition hover:scale-110 duration-300 mr-1">
                <Icon
                name={'basic/trash_full'}
                size="1em"
                color="white"
                />
            </div>
            {#if editProject === true && editingId === project.id}
                <EditProjectModal 
                    on:close={()=>{editProject = false}}
                    supabaseClient={supabaseClient}
                    on:edit={fetchProjects}
                    id={project.id}
                    title={project.title} 
                    description={project.description} 
                    is_private={project.is_private} 
                />
            {/if}
        </div>
    {/each}
</div>

{#if newProject === true}
    <NewProjectModal  user_id={user_id} supabaseClient={supabaseClient} on:close={()=>{newProject = false}}/>
{/if}