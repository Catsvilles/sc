import type { Project } from "$lib/editor/api/project";

export interface Player {
  loop: boolean;
  playing: boolean;
  startCursor: number;
  endCursor: number;
  masterGain: AudioNode;

  start(project: Project, start?: number, end?: number): this;
  stop(): this;
  toggle(project: Project, start?: number, end?: number): this;
}
