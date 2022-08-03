import { NetUtils } from "./utils/net.utils";
import { CommunicationEvent } from "./communication/communication.enum";
import { Configuration } from "./configuration/configuration";
import { Displayer } from "./displayer/displayer";
import { Communication } from "./communication/communication";
import { UserInput } from "./user-input/user-input";
import { UserInputEvent } from "./user-input/user-input.enum";
import { AudioSystem } from "./audio-system/audio-system";
export class ConsoleMessenger {
  constructor(
    private config: Configuration,
    private communication: Communication,
    private displayer: Displayer,
    private userInput: UserInput,
    private audioSystem: AudioSystem
  ) {}

  public async start(): Promise<void> {
    try {
      this.config.load();
    } catch (err: any) {
      this.displayer.print(err.message);
      process.exit();
    }
    this.userInput.event.on(UserInputEvent.ENTER_KEYDOWN, (data: string) =>
      this.onEnter(data)
    );
    this.communication.event.on(
      CommunicationEvent.MESSAGE,
      (message: string) => {
        this.displayer.receiveMessage(message);
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
    this.userInput.clearLine();

    if (data[0] === "/") {
      this.runCommande(data);
    } else {
      if (this.config.silent) {
        this.audioSystem.bell();
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
