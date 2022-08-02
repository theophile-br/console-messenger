import { EventEmitter } from "stream";

export abstract class Communication {
  public readonly event: EventEmitter = new EventEmitter();

  public sendMessage(data: string): void {
    throw new Error("Method Not Implemented");
  }

  public netScan(): void {
    throw new Error("Method Not Implemented");
  }
}
