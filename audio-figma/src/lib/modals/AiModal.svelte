<script lang="ts">
    export let hideAiModal;
	let actionTitle = 'Magic Assistant';

    function closeModal() {
        hideAiModal = true;       
    }
</script>

<div class="z-50 fixed flex items-center justify-center w-full h-full top-0 left-0">
    <div on:pointerdown="{closeModal}" class="absolute glassmorphism w-full h-full bg-cover bg-opacity-75 blur-sm"></div>
    <div class="flex flex-col gap-4 w-full md:w-10/12 h-min shadow-lg z-50 rounded-lg font-semibold p-4">
        <div class="flex justify-end items-center">
            <div on:pointerdown="{closeModal}" class="cursor-pointer z-50">
                <svg class="fill-current text-neutral-300" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18">
                    <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                </svg>
            </div>
        </div>
        <div class="flex justify-center text-2xl text-center text-orange-500 mb-6 uppercase">{actionTitle}</div>
        <p class="text-center text-white">Get help from our AI to do things at lightspeed!</p>
        <div class="flex flex-col justify-center items-center gap-10 m-4">
            <div class="flex w-full">
                <textarea id="message" rows="8" class="block p-2.5 w-full text-sm rounded-l-lg border bg-gray-700 border-gray-600 placeholder-gray-400 text-white" placeholder="Your message...">Slice this second clip in the first track into a separate clip and apply a smooth fade-in effect at the beginning and a fade-out effect at the end.

In the second track, find the clip starting at 20 seconds. Slice this clip into two parts, removing the middle section entirely. Apply a crossfade effect at the transition between the two remaining parts for a seamless blend. 

Identify the audio segment from 30 to 55 in the third track. Slice this segment into smaller clips at equal intervals, creating a rhythmic pattern. Apply a fade-in effect to the beginning of each clip for a gradual entrance.
                    </textarea>
                <button class="uppercase px-4 py-2 text-white bg-orange-500 text-xs cursor-pointer hover:animate-pulse rounded-r-lg" disabled>
                    Submit
                </button>
            </div>
        </div>
    </div>
</div>



