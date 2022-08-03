import { EventEmitter } from "stream";

export interface UserInput {
  memory: string;
  cursorPosition: number;
  readonly event: EventEmitter;
  clearLine(): void;
  cut(): void;
  paste(): void;
}
