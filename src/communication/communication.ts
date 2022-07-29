import { EventEmitter } from "stream";
import { Configuration } from "../configuration/configuration";
import { Cryptography } from "../cryptography/cyptography";

export abstract class Communication {
  public readonly event: EventEmitter = new EventEmitter();

  constructor(
    protected crypto: Cryptography,
    protected config: Configuration
  ) {}

  public sendMessage(data: string): void {
    throw new Error("Method Not Implemented");
  }

  public netScan(): void {
    throw new Error("Method Not Implemented");
  }
}
