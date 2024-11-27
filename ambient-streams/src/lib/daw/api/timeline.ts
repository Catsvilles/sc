import { Source, GraphNode } from "./graph";
import type { Player } from "$lib/daw/api/player";

interface Lane {
  time: number;
  value: number;
}

export abstract class Clip {
  name: string;
  length = 1;
  controlPoints : number[];
  linearPoints : Lane[];
  extent = 1;
  extentPast = 0;
  showFades = false;

  start = 0;

  constructor(name: string) {
    this.name = name;
  }

  get totalExtent(): number {
    return this.extent - this.extentPast;
  }

  abstract duplicate(): Clip;
}

export class AbstractClip extends Clip {
  constructor(name = "") {
    super(name);
  }

  duplicate(): Clip {
    const clip = new AbstractClip();
    clip.length = this.length;
    clip.controlPoints = this.controlPoints;
    clip.linearPoints = this.linearPoints;
    clip.extent = this.extent;
    clip.extentPast = this.extentPast;
    clip.start = this.start;

    return clip;
  }
}

export class Track<T extends Source<Player>> extends GraphNode<T> {
  name = "Track";
  description: string;
  enabled = true;
  height = 64;
  selected = false;

  clips: Clip[] = [];
}
