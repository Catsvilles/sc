<script lang="ts">
    export let hideModal;
    export let actionTitle = 'Shortcuts';

    function closeModal() {
        hideModal = true;
    }

    let shortcuts = [
        {
            action: 'Save current progress and upload to storage',
            keys: 'Ctrl+S'
        },
        {
            action: 'Duplicate',
            keys: 'Ctrl+D'
        },
        {
            action: 'Enter Slicer Mode',
            keys: 'ALT'
        },
        {
            action: 'Slice Clip',
            keys: 'ALT+LeftClick'
        },
        {
            action: 'Scroll through timeline',
            keys: 'Press mousewheel and drag'
        },
        {
            action: 'Zoom In/Out',
            keys: 'Ctrl + Mousewheel'
        },
        {
            action: 'Disable or Solo Track',
            keys: 'Left or Right Click on Track Circle Button'
        },
        {
            action: 'Delete Track',
            keys: 'Select track and press Delete key'
        },
        {
            action: 'Delete Clip',
            keys: 'Select clip and press Delete key'
        },
    ]
</script>
<div class="flex items-center justify-center z-50 fixed w-full h-full top-0 left-0">
    <div on:pointerdown={closeModal} class="absolute glassmorphism w-full h-full bg-cover bg-opacity-75 blur-sm"></div>
    <div class="flex items-center justify-center w-11/12 lg:w-9/12 h-min mx-auto shadow-lg z-50 overflow-y-auto rounded-md py-6">
        <div class="text-center text-neutral-300">
            <div class="flex justify-end items-center">
                <div on:pointerdown={closeModal} class="cursor-pointer z-50">
                    <svg class="fill-current text-neutral-300" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                        <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                    </svg>
                </div>
            </div>
            <div class="flex justify-center text-2xl text-center text-orange-500 mb-6 uppercase font-semibold">{actionTitle}</div>
            <div class="flex lg:flex-row flex-col gap-4">
                <div class="flex flex-col gap-2 items-center justify-center text-xs bg-[#333333] p-3 rounded-md">
                    <span class="text-lg uppercase font-semibold">Mac</span>
                    {#each shortcuts as shortcut}
                        <div class="flex justify-between w-96 bg-[#262626] py-1 px-2 rounded-md">
                            <p>{shortcut.action}</p>
                            <p class="text-violet-500">{shortcut.keys}</p>
                        </div>
                    {/each}
                </div>
                <div class="flex flex-col gap-2 items-center justify-center text-xs bg-[#333333] p-3 rounded-md">
                    <span class="text-lg uppercase font-semibold">Windows</span>
                    {#each shortcuts as shortcut}
                        <div class="flex justify-between w-96 bg-[#262626] py-1 px-2 rounded-md">
                            <p>{shortcut.action}</p>
                            <p class="text-violet-500">{shortcut.keys}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
