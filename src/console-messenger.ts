import { NetUtils } from "./utils/net.utils";
import { CommunicationEvent } from "./communication/communication.enum";
import { IConfiguration } from "./configuration/configuration.interface";
import { IDisplay } from "./display/display.interface";
import { ICommunication } from "./communication/communication.interface";
import { IUserInput } from "./user-input/user-input.interface";
import { UserInputEvent } from "./user-input/user-input.enum";
import { IAudioSystem } from "./audio-system/audio-system.interface";
export class ConsoleMessenger {
  constructor(
    private config: IConfiguration,
    private communication: ICommunication,
    private display: IDisplay,
    private userInput: IUserInput,
    private audioSystem: IAudioSystem
  ) {}

  public async start(): Promise<void> {
    try {
      this.config.load();
    } catch (err: any) {
      this.display.print(err.message);
      process.exit();
    }
    this.userInput.event.on(UserInputEvent.ENTER_KEYDOWN, (data: string) =>
      this.onEnter(data)
    );
    this.communication.event.on(
      CommunicationEvent.MESSAGE,
      (message: string) => {
        if (this.config.silent) {
          this.audioSystem.bell();
        }
        this.display.receiveMessage(message);
      }
    );

    this.communication.event.on(CommunicationEvent.CLOSE, () => {
      this.display.print("program stop");
      process.exit();
    });

    this.communication.event.on(CommunicationEvent.CLOSE, (err) => {
      this.display.print(`server error:\n${err.stack}`);
      process.exit();
    });

    this.communication.event.on(CommunicationEvent.LISTENING, () => {
      console.clear();
      if (this.config.room !== "") {
        this.display.print(`Enter un room ${this.config.room}`);
      }
      this.display.print(
        `My Local adresse IP is ${NetUtils.getMyLocalIPv4()}/${NetUtils.getMyLocalIPv4Mask()}`
      );
      this.display.print(`My BroadcastAddr is ${NetUtils.getBroadcastIPv4()}`);
      this.display.print("scaning network please wait..");
      this.communication.netScan();
    });
  }

  private onEnter(data: string) {
    this.userInput.clearLine();

    if (data[0] === "/") {
      this.runCommand(data);
    } else {
      this.communication.sendMessage(data);
      this.display.print(`${"YOU"} : ${data}`);
    }
  }

  private runCommand(data: string) {
    if (data === "/scan") {
      this.display.print("scaning network please wait..");
      this.communication.netScan();
      return;
    }
  }
}
