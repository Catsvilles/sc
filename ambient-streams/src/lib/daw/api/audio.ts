import type { Player } from "$lib/daw/api/player";
import type { Project } from "$lib/daw/api/project";
import { Clip, Track } from "$lib/daw/api/timeline";
import { volume, pan, automationVol } from "$lib/daw/stores/effects";

import {
  ParameterAccuracy,
  ParameterType,
  Source,
} from "$lib/daw/api/graph";
import type { SourceScheduler } from "$lib/daw/api/graph";
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
    // const panNode = ctx.createStereoPanner();    
    // panNode.pan.value = this.parameters[1].value;
    // outNode.gain.value = this.parameters[0].value;
    
    // volume.subscribe(value => {
    //   outNode.gain.value = this.parameters[0].value;
    // });

    // pan.subscribe(value => {
    //   panNode.pan.value = this.parameters[1].value;
    // });

    return {
      connect(destination: AudioParam | AudioNode, output = 0, input = 0) {       
        // if (destination instanceof AudioParam) {
        //   outNode.connect(panNode);
        //   panNode.connect(track.gainNode, output);
        // } else {
        //   outNode.connect(panNode);
        //   panNode.connect(track.gainNode, output, input);
        // }
        // outNode.connect(panNode);
        // panNode.connect(track.gainNode);
        if (destination instanceof AudioParam) {
          outNode.connect(destination, output);
        } else {
          outNode.connect(destination, output, input);
        }
      },

      playClip(clip: AudioClip, when = 0, offset = 0): void {
        const duration = clip.extent - offset;
        const wrappedOffset =
          (offset % clip.length + clip.length) % clip.length;

        const source = ctx.createBufferSource();
        source.loop = true;

        if (player.loopingPoints.length > 0) {
          source.loopStart = (ctx.currentTime + when) - player.loopingPoints[0];
          source.loopEnd = (ctx.currentTime + when) - player.loopingPoints[1];
        }

        // if(clip.linearPoints.length > 0) {
        //   automationVol.subscribe(value => {            
        //     const lastControlPointerIndex =  clip.linearPoints.length - 1;
        //     let currentControlPointIndex = lastControlPointerIndex;
        //     let lastRamp = true;
        //     while (currentControlPointIndex >= 0 && player.currentTime <= clip.linearPoints[currentControlPointIndex].time) {
        //       const controlPoint = clip.linearPoints[currentControlPointIndex];
        //       const absoluteTime = ctx.currentTime + controlPoint.time - player.currentTime;
        //       outNode.gain.linearRampToValueAtTime(controlPoint.value, absoluteTime);
        //       if (lastRamp) {
        //         lastRamp = false;
        //         outNode.gain.linearRampToValueAtTime(controlPoint.value, absoluteTime + 1E5);
        //       }
        //       --currentControlPointIndex;
        //     }

        //     //Quick fix for when we clear the lanes
        //     if(clip.linearPoints.length <= 0) {
        //       return;
        //     }

        //     let startingValue : number;
        //     if (currentControlPointIndex === -1) {
        //       startingValue = clip.linearPoints[0].value;
        //     } else {
        //       if (currentControlPointIndex === lastControlPointerIndex) {
        //         startingValue = clip.linearPoints[lastControlPointerIndex].value;
        //       } else {
        //         const controlPointA = clip.linearPoints[currentControlPointIndex];
        //         const controlPointB = clip.linearPoints[currentControlPointIndex + 1];
          
        //         const time0 = controlPointA.time;
        //         const timeRatio = (player.currentTime - time0) / (controlPointB.time - time0);
          
        //         const value0 = controlPointA.value;
        //         startingValue = value0 + timeRatio * (controlPointB.value - value0);
        //       }
        //     }        
        //     outNode.gain.linearRampToValueAtTime(startingValue, ctx.currentTime + when);            
        //   });
        // }

        source.connect(outNode);
        //outNode.connect(player.masterGain);

        player.decodeBlob(clip.blob).then(buffer => {
          source.buffer = buffer;

          source.start(ctx.currentTime + when, wrappedOffset);
          source.stop(ctx.currentTime + when + duration);               
        });
      },

      stop(): void {        
        outNode.disconnect();
        // panNode.disconnect();
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
  gainNode: GainNode;
  constructor(player : AudioPlayer) {
    super({
      effect: new AudioClipPlayer(),
    });
    
    this.gainNode = player.context.createGain();
    //player.masterGain.connect(this.gainNode);
    this.gainNode.connect(player.masterGain);
  }
}

export class AudioPlayer implements Player {
  loop = false;
  loopingPoints = [];
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
    //this.masterGain.connect(this.#ctx.destination);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

        scheduler.connect(track.gainNode);
        //scheduler.connect(this.masterGain);
        this.#runningJobs.add(scheduler);

        for (let i = 0; i < track.clips.length; i++) {
          const clip = track.clips[i];          

          if (this.currentTime > clip.start + clip.extent) {
            continue;
          }

          let when = clip.start + clip.extentPast - this.currentTime;
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
    this.masterGain = this.#ctx.createGain();
    this.masterGain.connect(this.#ctx.destination);
  }

  decodeBlob(blob: Blob): Promise<AudioBuffer> {    
    if (blob instanceof Blob || toString.call(blob) === '[object Blob]') {
      let promise = this.#decodedBlobs.get(blob);
      if (!promise) {
        promise = blob
          .arrayBuffer()
          .then(buffer => this.#ctx.decodeAudioData(buffer));
  
        this.#decodedBlobs.set(blob, promise);
      }
  
      return promise;
    } else {
      //Assume it's audiobuffer
      const buffer : AudioBuffer = blob;
      const promise = new Promise((resolve, reject) => {
        resolve(buffer)
      });
      return promise;    }

  }
}
