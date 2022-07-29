// TODO: https://dev.to/swensson/create-a-p2p-network-with-node-from-scratch-1pah
import { Configuration } from "../configuration/configuration";
import { Cryptography } from "../cryptography/cyptography";
import { Communication } from "./communication";

export class Peer2PeerCommunication extends Communication {
  constructor(crypto: Cryptography, config: Configuration) {
    super(crypto, config);
  }

  public sendMessage(data: string): void {
    throw new Error("Method Not Implemented");
  }

  public netScan(): void {
    throw new Error("Method Not Implemented");
  }
}
