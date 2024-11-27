<script>
  import PlayButton from '$lib/players/PlayButton.svelte';
  export let track;
</script>

<style>
  [class^="number-slide"],
  [class*=" number-slide"] {
    background: grey;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 180px;
    max-height: 100vh;
  }
 .item {
      background-repeat: no-repeat;
      background-size: cover;
      background-position: top left;
  }
  .inner {
      position: absolute;
      bottom: 70%;
      left: 0;
      right: 0;
      text-align: center;
      z-index: 10;
  }
 .featured-post-text-wrap {
      width: 100%;
      position: relative;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
  }
 .featured-post-text a {
    vertical-align: middle;
    z-index: 8;
    position: relative;
    text-align: center;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.5);
  }
  .offer-btn {
    z-index: 10;
  }
  div :global(.circle-around:hover) {
    background: transparent !important;
    border: 2px solid #fff !important;
  }
</style>
<div class="owl-carousel item keen-slider__slide number-slide" style="background-image:url(images/covers/{track.data.category.slug}/{track.data.img.title})">
    <div class="overlay"></div>
    <div class="inner">
        <div class="featured-post-text-wrap">
            <p rel=prefetch class="featured-post-text"><a href="/track/{track.data.slug}">{track.data.title}</a></p>
        </div>
    </div>
    <div class="offer-btn">
    <PlayButton
      widthHeight={68}
      fontSize={22}
      track={track} />
    </div>
</div>
