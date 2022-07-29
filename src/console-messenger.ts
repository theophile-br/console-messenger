import { IConfigurationLoader } from "./config/argparse.config";
import {
  BroadcastCommunication,
  CommunicationEvent,
} from "./communication/broadcast.communication";
import readline from "readline";
import { stdin, stdout } from "process";
import { CryptoCodec } from "./cryptography/cipher.crypto";
import { NetUtils } from "./utils/net.utils";
const rl = readline.createInterface(stdin, stdout);
export class ConsoleMessenger {
  private config: IConfigurationLoader;
  private communication: BroadcastCommunication;
  private crypto: CryptoCodec;

  constructor(
    ConfigClass: new () => IConfigurationLoader,
    CryptoClass: new () => CryptoCodec,
    CommunicationClass: new (
      crypto: CryptoCodec,
      config: IConfigurationLoader
    ) => BroadcastCommunication
  ) {
    this.config = new ConfigClass();
    this.crypto = new CryptoClass();
    this.communication = new CommunicationClass(this.crypto, this.config);
  }

  public async start(): Promise<void> {
    this.config.load();
    rl.on("line", (data: string) => this.onEnter(data));
    this.communication.event.on(
      CommunicationEvent.MESSAGE,
      (message: string) => {
        const mem = rl.line;
        (rl as any).line = ""; //TODO: Change this ugly thing
        readline.clearLine(process.stdin, 0);
        readline.cursorTo(process.stdin, 0);
        rl.pause();
        console.log(message);
        rl.write(mem);
        rl.resume();
      }
    );

    this.communication.event.on(CommunicationEvent.CLOSE, () => {
      console.log("program stop");
      process.exit();
    });

    this.communication.event.on(CommunicationEvent.CLOSE, (err) => {
      console.log(`server error:\n${err.stack}`);
      process.exit();
    });

    this.communication.event.on(CommunicationEvent.LISTENING, () => {
      console.clear();
      if (this.config.room !== "") {
        console.log(`Enter un room ${this.config.room}`);
      }
      console.log(
        `My Local adresse IP is ${NetUtils.getMyLocalIPv4()}/${NetUtils.getMyLocalIPv4Mask()}`
      );
      console.log(`My BroadcastAddr is ${NetUtils.getBroadcastIPv4()}`);
      this.communication.netScan();
    });
  }

  private onEnter(data: string) {
    readline.moveCursor(process.stdin, 0, -1);
    readline.clearLine(process.stdin, 0);

    if (data[0] === "/") {
      this.runCommande(data);
    } else {
      this.communication.sendMessage(data);
      console.log(`${"YOU"} : ${data}`);
    }
  }

  private runCommande(data: string) {
    if (data === "/scan") {
      this.communication.netScan();
      return;
    }
  }
}
