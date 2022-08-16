import { NetUtils } from "./utils/net.utils";
import { CommunicationEvent } from "./communication/communication.enum";
import { IConfiguration } from "./configuration/configuration.interface";
import { IDisplay } from "./display/display.interface";
import { ICommunication } from "./communication/communication.interface";
import { IUserInput } from "./user-input/user-input.interface";
import { UserInputEvent } from "./user-input/user-input.enum";
import { IAudioSystem } from "./audio-system/audio-system.interface";
import { ICryptography } from "./cryptography/cryptography.interface";
import { CipherCrypto } from "./cryptography/cipher.cryptography";

export type UserInfo = {
  pseudo: string;
  ip: string;
};

export type UserMessage = {
  user: UserInfo;
  message: string;
};

export class ConsoleMessenger {
  constructor(
    private config: IConfiguration,
    private communication: ICommunication,
    private crypto: ICryptography,
    private display: IDisplay,
    private userInput: IUserInput,
    private audioSystem: IAudioSystem
  ) {}

  public async start(): Promise<void> {
    // Load Config
    try {
      this.config.load();
    } catch (err) {
      this.display.print((err as Error).message);
      process.exit();
    }

    // User Keyboard Event
    this.userInput.event.on(UserInputEvent.ENTER_KEYDOWN, (data: string) =>
      this.onEnter(data)
    );

    // Event Listening
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
      this.display.print("Program stop");
      process.exit();
    });

    this.communication.event.on(CommunicationEvent.ERROR, (err) => {
      this.display.print(`Server error:\n${err.stack}`);
      process.exit();
    });

    this.communication.event.on(CommunicationEvent.LISTENING, () => {
      console.clear();
      if (this.config.room) {
        this.display.print(`Enter in room ${this.config.room}`);
        if (this.crypto instanceof CipherCrypto) {
          this.crypto.setupSecret(this.config.room);
        }
      }
      this.display.print(
        `My Local address IP is ${NetUtils.getMyLocalIPv4()}/${NetUtils.getMyLocalIPv4Mask()}`
      );
      this.display.print(`My BroadcastAddr is ${NetUtils.getBroadcastIPv4()}`);
      this.display.print("Scanning network please wait..");
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
      this.display.print("Scanning network please wait..");
      this.communication.netScan();
      return;
    }
  }
}
