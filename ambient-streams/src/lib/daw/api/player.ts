import type { Project } from "$lib/daw/api/project";

export interface Player {
  loop: boolean;
  playing: boolean;
  loopingPoints: number[];
  startCursor: number;
  endCursor: number;
  masterGain: AudioNode;

  start(project: Project, start?: number, end?: number): this;
  stop(): this;
  toggle(project: Project, start?: number, end?: number): this;
}
