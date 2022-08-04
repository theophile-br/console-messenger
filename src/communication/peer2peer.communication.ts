// TODO: https://dev.to/swensson/create-a-p2p-network-with-node-from-scratch-1pah
import { EventEmitter } from "stream";
import { ICommunication } from "./communication.interface";

export class Peer2PeerCommunication implements ICommunication {
  public readonly event: EventEmitter = new EventEmitter();
  public sendMessage(data: string): void {
    throw new Error("Method Not Implemented");
  }

  public netScan(): void {
    throw new Error("Method Not Implemented");
  }
}
