import { EventEmitter } from "stream";

export abstract class Configuration {
  pseudo?: string;
  room?: string;
  silent?: boolean;
  load(): void {
    throw new Error("Method Not Implemented");
  }
}
