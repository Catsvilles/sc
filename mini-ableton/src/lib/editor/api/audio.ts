import type { Player } from "$lib/editor/api/player";
import type { Project } from "$lib/editor/api/project";
import { Clip, Track } from "$lib/editor/api/timeline";
import { volume, pan, automationVol} from "$lib/editor/stores/effects";

import {
  ParameterAccuracy,
  ParameterType,
  Source,
} from "$lib/editor/api/graph";
import type { SourceScheduler } from "$lib/editor/api/graph";
export class AudioClip extends Clip {
  blob: Blob;

  constructor(
    name: string,
    blob: Blob,
    start: number,
    length: number,
    controlPoints = [],
    linearPoints = [],
    extent = length,
    extentPast = 0,
  ) {
    super(name);

    this.blob = blob;
    this.start = start;
    this.length = length;
    this.controlPoints = controlPoints;
    this.linearPoints = linearPoints;
    this.extent = extent;
    this.extentPast = extentPast;
  }

  duplicate(): Clip {
    return new AudioClip(
      this.name,
      this.blob,
      this.start,
      this.length,
      this.controlPoints,
      this.linearPoints,
      this.extent,
      this.extentPast,
    );
  }
}

export interface AudioSourceScheduler extends SourceScheduler {
  connect(
    destination: AudioParam | AudioNode,
    output?: number,
    input?: number,
  ): void;
}

export abstract class AudioSource extends Source<AudioPlayer> {
  abstract createScheduler(player: AudioPlayer): AudioSourceScheduler;
}

export class AudioClipPlayer extends AudioSource {
  constructor() {
    super([
      {
        name: "Volume",
        value: 1.0,
        min: 0.0,
        max: 1.0,
        accuracy: ParameterAccuracy.Sample,
        type: ParameterType.Absolute,
      },
      {
        name: "Pan",
        value: 0.0,
        min: -1.0,
        max: 1.0,
        accuracy: ParameterAccuracy.Sample,
        type: ParameterType.Relative,
      },
    ]);    
  }

  createScheduler(player: AudioPlayer): AudioSourceScheduler {
    const ctx = player.context;
    const outNode = ctx.createGain();
    const panNode = ctx.createStereoPanner();    
    panNode.pan.value = this.parameters[1].value;
    outNode.gain.value = this.parameters[0].value;
    
    volume.subscribe(value => {
      outNode.gain.value = this.parameters[0].value;
    });

    pan.subscribe(value => {
      panNode.pan.value = this.parameters[1].value;
    });

    return {
      connect(destination: AudioParam | AudioNode, output = 0, input = 0) {       
        if (destination instanceof AudioParam) {
          outNode.connect(panNode);
          panNode.connect(destination, output);
        } else {
          outNode.connect(panNode);
          panNode.connect(destination, output, input);
        }
      },

      playClip(clip: AudioClip, when = 0, offset = 0): void {
        const duration = clip.extent - offset;
        const wrappedOffset =
          (offset % clip.length + clip.length) % clip.length;

        const source = ctx.createBufferSource();
        source.loop = true;

        source.connect(outNode);

        player.decodeBlob(clip.blob).then(buffer => {
          source.buffer = buffer;

          source.start(ctx.currentTime + when, wrappedOffset);
          source.stop(ctx.currentTime + when + duration);          
        });
      },

      stop(): void {
        outNode.disconnect();
        panNode.disconnect();
      },
    };
  }

  canPlay(clip: Clip): clip is AudioClip {
    return clip instanceof AudioClip;
  }
}

export class AudioTrack extends Track<AudioClipPlayer> {
  description = "Audio";
  volume = 1.0;
  pan = 0.0;

  constructor() {
    super({
      effect: new AudioClipPlayer(),
    });
  }
}

export class AudioPlayer implements Player {
  loop = true;
  startCursor = 0;
  endCursor = 0;
  masterGain: GainNode;

  #ctx: BaseAudioContext;
  #decodedBlobs: WeakMap<Blob, Promise<AudioBuffer>> = new WeakMap();
  #playing = false;
  #isRecording = false;
  #startTime = 0;
  #runningJobs: Set<AudioSourceScheduler> = new Set();

  constructor(ctx: BaseAudioContext, project: Project) {
    this.#ctx = ctx;
    this.masterGain = this.#ctx.createGain();
  }

  // eslint-disable-next-line $lib/editor/typescript-eslint/no-unused-vars
  start(
    project: Project,
    start = this.startCursor,
    _end = this.endCursor,
  ): this {
    if (this.#playing) {
      return this;
    }

    this.#playing = true;
    this.#startTime = this.#ctx.currentTime - start;

    for (const track of project.tracks) {
      const source = track.mod;

      if (!track.enabled) {
        continue;
      }

      if (source instanceof AudioSource) {
        const scheduler = source.createScheduler(this);
        scheduler.connect(this.masterGain);
        this.masterGain.connect(this.#ctx.destination);

        this.#runningJobs.add(scheduler);

        for (let i = 0; i < track.clips.length; i++) {
          const clip = track.clips[i];          

          if (this.currentTime > clip.start + clip.extent) {
            continue;
          }

          let when = (clip.start) + clip.extentPast - this.currentTime
          const offset = Math.max(
            this.currentTime - clip.start,
            clip.extentPast,
          );

          when = Math.max(when, 0);
          scheduler.playClip(clip, when, offset);
        }
      }
    }

    return this;
  }

  stop(): this {
    if (!this.#playing) {
      return;
    }

    this.#playing = false;
    this.#runningJobs.forEach(job => job.stop());
    this.#runningJobs.clear();

    return this;
  }

  toggle(
    project: Project,
    start = this.startCursor,
    end = this.endCursor,
  ): this {
    if (this.#playing) {
      return this.stop();
    } else {
      return this.start(project, start, end);
    }
  }

  get playing(): boolean {
    return this.#playing;
  }

  get isRecording(): boolean {
    return this.#isRecording;
  }

  set isRecording(isRecording) {
    this.#isRecording = isRecording;
  }

  get sampleRate(): number {
    return this.#ctx.sampleRate;
  }

  get currentTime(): number {
    return (
      this.#playing ? this.#ctx.currentTime - this.#startTime : this.startCursor
    );
  }

  get context(): BaseAudioContext {
    return this.#ctx;
  }

  setContext(newCtx : BaseAudioContext ) {
    this.#ctx = newCtx;
  }

  decodeBlob(blob: Blob): Promise<AudioBuffer> {   
    let promise = this.#decodedBlobs.get(blob);

    if (!promise) {
      promise = blob
        .arrayBuffer()
        .then(buffer => this.#ctx.decodeAudioData(buffer));

      this.#decodedBlobs.set(blob, promise);
    }

    return promise;
  }
}
