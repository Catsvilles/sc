<script lang="ts">
 	import { onMount, afterUpdate } from "svelte";
	import { page } from '$app/stores';
	import Icon from "@components/Icon.svelte";
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let supabaseClient;
    export let user_id: number;
	export let user_name: string;

	let editing: boolean = false;
  	let editingId: number;
	let comments: Comment[] = [];
	let message: string = '';
	let textarea: HTMLTextAreaElement;
	let chat: HTMLDivElement;

	let loading: boolean = false;

	interface Comment {
		user_name: string
		text: string
		id: number 
		user_id: number
		post_id: number
		created_at: Date
		updated_at: Date
		project_id: number
	};

	onMount(() => {
		fetchComments();
		loading = true;
	});

	afterUpdate(() => {
		scrollToEnd();
	});

	const fetchComments = async () => {
		let { data, error } = await supabaseClient
		.from("comments")
		.select("*")
		.order('created_at')
		if (error) {
			console.log("error", error);
		} else {
			comments = data;
		}
	};

	const postComment = async (comment: string) => {
		let text = comment
		console.log(text, user_id, user_name);
		
		let { data, error } = await supabaseClient
		.from("comments")
		.insert({text, user_id, user_name})
		.select()
		if (error) {
			console.log("error", error);
		} else {
			data = comment;
		}
		fetchComments();
		textarea.value = '';
		message = '';
	};

	const editComment = async (id:number, comment: string) => { 
		let text = comment
		let { data, error } = await supabaseClient
		.from("comments")
		.update({text})
		.eq("id", id)
		.select()
		.single();
		if (error) {
			console.log("error", error);
		} else {
			data = comment;
		}
		editing = false; 
		fetchComments();
	};
  
	const deleteComment = async (id:number) => {
		try {
		await supabaseClient
		.from("comments")
		.delete()
		.eq("id", id)
		}
		catch (error) {
		console.log("error", error);
		}
		fetchComments();
	};

	function enterEditingState(id: number) {
		editingId = id;
		editing = true;
  	};

	function keydown(event: KeyboardEvent) {
		if (event.key == 'Escape') {
		event.preventDefault();
		editing = false;
		} else if(event.key == 'Enter' && message.trim().length > 0){
			event.preventDefault();
			postComment(message);
			textarea.value = '';
			message = '';
		} else {
			event.stopImmediatePropagation();
			event.stopPropagation();
			return false;
		}
	};

	function scrollToEnd() {
	    chat.scrollTop = chat.scrollHeight;  
	};
</script>

<div class="flex flex-col h-screen bg-[#333333]">
	<div bind:this={chat} class="w-full h-5/6 overflow-y-scroll mx-auto px-4">
		<div class="sticky top-0 flex items-center justify-end w-full cursor-pointer py-2 bg-[#333333] z-30">
			<button on:pointerdown={()=>{dispatch('close')}}>
				<Icon
					name="edit/off_outline_close"
					size="1.5em"
					color="gray"
				/>
			</button>
		</div>
		{#each comments as comment (comment.id)}
			{#if loading == false}
				<div class="flex justify-between items-center gap-2 w-full my-2">
					<div class="w-12">
						<div class="w-10 h-10 rounded-full bg-[#262626]"></div>
					</div>
					<div class="w-full h-14 rounded-md bg-[#262626]"></div>
				</div>
			{:else}
				{#if comment.user_id === user_id}
					<span class="flex flex-col items-end justify-end w-full text-white text-xs">
						<div class="flex items-center">
							You
							<div class="dropdown inline-block relative">
								<Icon
									name="menu/more_vertical"
									size="1.5em"
									color="gray"
								/>
								<ul class="dropdown-menu absolute hidden right-1 pt-1 text-xs text-[gray] rounded-md">
									<li><button on:pointerdown={()=>{ enterEditingState(comment.id) }} class="bg-[#333333] hover:bg-[#262626] py-1 px-4 block whitespace-no-wrap w-full hover:text-gray-400">Edit</button></li>
									<li><button on:pointerdown={()=>{ deleteComment(comment.id) }} class="bg-[#333333] hover:bg-[#262626] py-1 px-4 block whitespace-no-wrap hover:text-gray-400">Delete</button></li>
								</ul>
							</div>
						</div>
						<p class="text-sm"><time class="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString(['en-US'], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time></p>
					</span>
					<div class="flex items-center justify-end w-full text-white text-xs">
						<article class="p-2 my-2 w-full bg-orange-500 text-[white] rounded-bl-md rounded-tl-md rounded-br-md">
							{#if editing && editingId === comment.id}
								<form on:submit|preventDefault={() =>{if(comment.text.trim().length > 0 ){ editComment(comment.id, comment.text)}}}>
									<textarea required on:keydown={keydown}  rows="3" class="w-full border border-orange-500 bg-[#262626] focus:ring-0 focus:outline-none rounded-lg" bind:value={comment.text}></textarea>
									<button type="submit" class="text-center font text-white w-full">
										Edit
									</button>
								</form>
							{:else}
								{comment.text}
							{/if}
						</article>
					</div>
				{:else}
					<div class="flex gap-4">
						<div class="w-12">
							<img class="w-10 h-10 rounded-full" src="https://picsum.photos/200/300" alt="{$page.data.user}">
						</div>
						<div class="w-full">
							<p class="text-white text-xs">{comment.user_name}</p>
							<p class="text-sm"><time class="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString(['en-US'], { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time></p>
							<article class="p-2 my-2 bg-[#262626] text-[white] rounded-bl-md rounded-tr-md rounded-br-md text-xs">
								{comment.text}
							</article>
						</div>
					</div>
				{/if}
			{/if}
		{/each}
	</div>
	<form class="flex w-full bg-[#333333] p-2" on:submit|preventDefault={()=>{if( message.trim().length > 0 ){postComment(message)}}}>
		<div class="flex w-full bg-[#262626] rounded-md">
			<textarea rows="4" on:keydown={keydown} id="message" bind:this={textarea} bind:value={message} class="bg-[#262626] p-1 w-full text-sm text-gray-400 border-0 focus:ring-0 focus:outline-none rounded-l-md z-30" maxlength="580" placeholder="Write message here" required></textarea>
			<button type="submit" class="flex items-center justify-center bg-[#262626] rounded-r-md p-1 border-l-2 border-[#363636]">
				<Icon
					name="arrow/circle_right"
					size="1.5em"
					color="gray"
				/>
			</button>
		</div>
	</form>
</div>



