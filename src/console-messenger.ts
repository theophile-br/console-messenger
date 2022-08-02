import readline from "readline";
import { stdin, stdout } from "process";
import { NetUtils } from "./utils/net.utils";
import { Cryptography } from "./cryptography/cyptography";
import { CommunicationEvent } from "./communication/communication.enum";
import { Configuration } from "./configuration/configuration";
import { Displayer } from "./displayer/displayer";
import { Communication } from "./communication/communication";
const rl = readline.createInterface(stdin, stdout);
export class ConsoleMessenger {
  constructor(
    private config: Configuration,
    private communication: Communication,
    private crypto: Cryptography,
    private displayer: Displayer
  ) {}

  public async start(): Promise<void> {
    try {
      this.config.load();
    } catch (err: any) {
      this.displayer.print(err.message);
      process.exit();
    }
    rl.on("line", (data: string) => this.onEnter(data));
    this.communication.event.on(
      CommunicationEvent.MESSAGE,
      (message: string) => {
        // TODO: Create "service" class for that
        const mem = rl.line;
        (rl as any).line = ""; //TODO: Change this ugly thing
        readline.clearLine(process.stdin, 0);
        readline.cursorTo(process.stdin, 0);
        rl.pause();
        this.displayer.print(message);
        rl.write(mem);
        rl.resume();
      }
    );

    this.communication.event.on(CommunicationEvent.CLOSE, () => {
      this.displayer.print("program stop");
      process.exit();
    });

    this.communication.event.on(CommunicationEvent.CLOSE, (err) => {
      this.displayer.print(`server error:\n${err.stack}`);
      process.exit();
    });

    this.communication.event.on(CommunicationEvent.LISTENING, () => {
      console.clear();
      if (this.config.room !== "") {
        this.displayer.print(`Enter un room ${this.config.room}`);
      }
      this.displayer.print(
        `My Local adresse IP is ${NetUtils.getMyLocalIPv4()}/${NetUtils.getMyLocalIPv4Mask()}`
      );
      this.displayer.print(
        `My BroadcastAddr is ${NetUtils.getBroadcastIPv4()}`
      );
      this.displayer.print("scaning network please wait..");
      this.communication.netScan();
    });
  }

  private onEnter(data: string) {
    readline.moveCursor(process.stdin, 0, -1);
    readline.clearLine(process.stdin, 0);

    if (data[0] === "/") {
      this.runCommande(data);
    } else {
      if (this.config.silent) {
        console.log("\u0007");
      }
      this.communication.sendMessage(data);
      this.displayer.print(`${"YOU"} : ${data}`);
    }
  }

  private runCommande(data: string) {
    if (data === "/scan") {
      this.displayer.print("scaning network please wait..");
      this.communication.netScan();
      return;
    }
  }
}
