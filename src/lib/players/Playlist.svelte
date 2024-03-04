<script lang="ts">
  import PlayButton from '$lib/players/PlayButton.svelte';
  import { playlist } from './../../stores/player';

  const removeAllSongs = () => {
    $playlist = [];
  };

  const removeSong = songUrl => {
    $playlist = $playlist.filter(song => song.url !== songUrl);
  };

  const setCurrentData = () => { // TODO: tests
    if (!$playlist.length) {
      localStorage.removeItem(' soundgrapePlaylist');
      return;
    }
    localStorage.setItem(' soundgrapePlaylist', JSON.stringify($playlist));
  };

</script>

<style>
  .playlist {
    position: fixed;
    z-index: 99;
    height: 325px;
    bottom: 75px;
    left: 0;
    right: 0;
    width: 100%;
    background: #fff;
  }

  @media all and (max-width: 770px) {
      .playlist {
          bottom: 105px;
      }
  }
  /*Table Style One*/
  .table .table-header{
    background: #8a005e;
    color:#fff;
  }
  .table .cell {
    padding: 7px;
  }
  td {
    padding: 7px!important;
  }
  .td-btn {
    background: transparent !important;
    border: 1px solid #333 !important;
    white-space: nowrap;
    text-align: center;
  }
</style>
<div class="playlist container">
  <div class="row">
    <div class="col-md-12 section-heading text-center">
    <h3>Your Playlist History</h3>
    </div>
  </div>
  <div class="row">
    <div class="col-md-12">
        <table class="table checkout-table">
            <tr class="table-header">
                <th class="cell">Info</th>
                <th class="cell"></th>
                <th class="cell">Remove</th>
            </tr>
            {#each $playlist as song (song.id)}
            <tr class="active">
              <div style="margin-top: 5px;">
                  <PlayButton track={song}/>
              </div>
                <td>
                  <a rel=prefetch href="track/{song.slug}">{song.title}</a>
                </td>
                <td><button type="button" class="td-btn" on:click="{() => removeSong(song.url)}"><i class="far fa-minus-square"></i></button></td>
            </tr>
            {:else}
            <tr class="active">
                <td>Play something and it will appear here.</td>
            </tr>
            {/each}
        </table>
        <button type="button" class="td-btn" on:click="{removeAllSongs}">Clear</button>
    </div>
  </div>
</div>

<svelte:window on:beforeunload={setCurrentData}/>
