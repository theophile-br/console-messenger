import { EventEmitter } from "stream";
import { UserInfo } from "../console-messenger";

export interface ICommunication {
  readonly event: EventEmitter;
  sendMessage(data: string): void;
  netScan(): Promise<UserInfo[]>;
}
