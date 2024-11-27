import type { Effect } from "$lib/daw/api/graph";
import ChannelMergerEffect from "$lib/daw/effects/ChannelMergerEffect";
import ChannelSplitterEffect from "$lib/daw/effects/ChannelSplitterEffect";
import CompressorEffect from "$lib/daw/effects/CompressorEffect";
import DelayEffect from "$lib/daw/effects/DelayEffect";
import GainEffect from "$lib/daw/effects/GainEffect";
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export interface ModuleDesc {
  name: string,
  class: new() => Effect,
}

export const modules: Writable<ModuleDesc[]> = writable([
  {
    name: "Channel merger",
    class: ChannelMergerEffect,
  },
  {
    name: "Channel splitter",
    class: ChannelSplitterEffect,
  },
  {
    name: "Gain",
    class: GainEffect,
  },
  {
    name: "Delay",
    class: DelayEffect,
  },
  {
    name: "Compressor",
    class: CompressorEffect,
  },
]);
