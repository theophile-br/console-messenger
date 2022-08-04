import { EventEmitter } from "stream";

export interface ICommunication {
  readonly event: EventEmitter;
  sendMessage(data: string): void;
  netScan(): void;
}
