<script lang="ts">
import player from "$lib/editor/stores/player";
import project from "$lib/editor/stores/project";

$: {
    // redraw when any of these change
    $project.tempo;
    setBpm($project.tempo);
  }

let playing: boolean = false;
type CreateSchedulerConfig = {
  audioContext: AudioContext;
  timeoutLookahead?: number;
  schedulerLookahead?: number;
  bpm: number;
  onTick: (count: number, when: number) => void;
};

type Scheduler = {
  setBpm: (value: number) => void;
  start: () => void;
  stop: () => void;
};

type CreateScheduler = (config: CreateSchedulerConfig) => Scheduler;

const createScheduler: CreateScheduler = (config) => {
  const timeoutLookahead = config.timeoutLookahead ?? 25;
  const schedulerLookahead = config.schedulerLookahead ?? 0.1;
  const audioContext = config.audioContext;
  const onTick = config.onTick;
  let bpm = config.bpm;

  let nextNoteTime: number;
  let timeoutId: number | undefined;
  let count = 0;

  const schedule = () => {
    while (nextNoteTime < audioContext.currentTime + schedulerLookahead) {
      onTick(count, nextNoteTime);
      nextNoteTime += 60 / bpm;
      count++;
    }

    timeoutId = window.setTimeout(schedule, timeoutLookahead);
  };

  const start = () => {
    if (timeoutId === undefined) {
      nextNoteTime = audioContext.currentTime;
      schedule();
    }
  };

  const stop = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
      count = 0;
    }
  };

  const setBpm = (value: number) => {
    bpm = value;
  };

  return {
    start,
    stop,
    setBpm
  };
};


type SampleSet = [string, string];

type CreateMetronomeConfig = {
  samples: SampleSet[];
};

type Metronome = {
  play: () => void;
  pause: () => void;
  destroy: () => void;
  setBpm: (value: number) => void;
  setVolume: (value: number) => void;
  setSampleSet: (value: number) => void;
  setTimeSignature: (value: number) => void;
  loadSamples: () => Promise<void>;
};

type CreateMetronome = (config: CreateMetronomeConfig) => Metronome;
  let sampleSet = 0;
  let timeSignature = 3;
  let samplesLoaded = false;
  let sampleBuffers: AudioBuffer[];
  const audioContext: AudioContext = new window.AudioContext();
  const gainNode = audioContext.createGain();
  const scheduler = createScheduler({
    audioContext,
    bpm: $project.tempo,
    onTick: (count, when) => {
      const beat = count % (timeSignature + 1);
      const accent = beat === 0 ? 1 : 0;
      const sample = sampleBuffers[sampleSet * 2 + accent];
      playSample(sample, when);
    },
  });

  const loadSamples = async () => {
    const res = await fetch('audio/wood.mp3', {
          method: "GET",
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin':'*'
          }
      });

    const blob = await res.blob();

    const resaccent = await fetch('audio/wood-accent.mp3', {
          method: "GET",
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Origin':'*'
          }
      });

    const blobaccent = await resaccent.blob();

    const arrayBuffers = [];

    const wood = await $player.decodeBlob(blob);
    arrayBuffers.push(wood);
    const woodaccent = await $player.decodeBlob(blobaccent);
    arrayBuffers.push(woodaccent);
    sampleBuffers = arrayBuffers;
    samplesLoaded = true;
  };

  const playSample = (buffer: AudioBuffer, when: number): void => {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(when);
  };

  const play = () => {
    if (!samplesLoaded) return;
    playing = true;
    scheduler.start();
  };

  const pause = () => {
    playing = false;
    scheduler.stop();
  };

  const destroy = () => {
    audioContext.close();
  };

  const setBpm = (value: number) => {
    scheduler.setBpm(value);
  };

  const setSampleSet = (value: number) => {
    sampleSet = value;
  };

  const setTimeSignature = (value: number) => {
    timeSignature = value;
  };

  const setVolume = (value: number) => {
    gainNode.gain.value = value / 100;
  };

  loadSamples();

  const handleClick = () => {
    playing ? pause() : play();
  };
</script>

<button on:click={handleClick} class="p-1.5 second-bg-color rounded-lg">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="{playing == true ? 'icon-fill-active' : 'icon-fill-inactive'} w-4 h-4">
    <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm320 96c0-15.9-5.8-30.4-15.3-41.6l76.6-147.4c6.1-11.8 1.5-26.3-10.2-32.4s-26.2-1.5-32.4 10.2L262.1 288.3c-2-.2-4-.3-6.1-.3c-35.3 0-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64z"/>
  </svg>
</button>