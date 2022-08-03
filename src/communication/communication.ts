import { EventEmitter } from "stream";

export interface Communication {
  readonly event: EventEmitter;
  sendMessage(data: string): void;
  netScan(): void;
}
