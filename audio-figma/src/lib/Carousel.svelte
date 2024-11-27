<script>
  //NOTE using this lazyload and not setting the src!
  import { lazyload } from './../actions/lazyload';
</script>
<div>
  <div class="h-full relative w-full pt-40 pb-60">
      <div class="absolute z-20 inset-0 w-full h-full border-[#1f2430] bg-opacity-75"></div>
      <div class="z-20 relative text-center text-white container mx-auto">
      <p class="text-3xl uppercase text-white font-bold mb-2 font ">Sound | Video</p>
      <p class="mb-6 text-white font text-xl">Music and Video Editing for Storytellers</p>
      <a rel="prefetch" href="/library" class="uppercase shadow-md border-white border-2 rounded-full px-4 py-2 text-white border-[#1f2430] bg-opacity-75 hover:bg-orange-700 hover:border-orange-500 hover:shadow-orange-900 ">Library</a>
    </div>
    <div class="h-full w-full top-0">
      <img
        use:lazyload
        src="https://soundgrape.s3.us-east-2.amazonaws.com/uploads/2021-11-14+17.23.58.jpg"
        data-src="https://soundgrape.s3.us-east-2.amazonaws.com/uploads/2021-11-14+17.23.58.jpg"
        alt="Royalty-free tt music" title="Royalty-free ds music"
        class="rounded-lg shadow-xl h-full w-full object-cover absolute top-1/2 left-1/2	min-h-full min-w-full transform -translate-x-1/2	-translate-y-1/2">
    </div>
  </div>
</div>
