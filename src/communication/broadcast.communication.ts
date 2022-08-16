import dgram from "dgram";
import { IConfiguration } from "../configuration/configuration.interface";
import { ICryptography } from "../cryptography/cryptography.interface";
import { NetUtils } from "../utils/net.utils";
import { CommunicationEvent } from "./communication.enum";
import { ICommunication } from "./communication.interface";
import { EventEmitter } from "stream";
import { UserInfo, UserMessage } from "../console-messenger";

enum ECode {
  HELLO,
  ACK,
  MESSAGE,
}

type BroadcastMessage = {
  code: ECode;
  data: UserMessage;
};

export class BroadcastCommunication implements ICommunication {
  private server = dgram.createSocket("udp4");
  private port = 41234;
  private carnet: UserInfo[] = [];
  public readonly event: EventEmitter = new EventEmitter();

  constructor(private crypto: ICryptography, private config: IConfiguration) {
    this.server.on("message", (buf, senderInfo) => {
      if (
        senderInfo.address === NetUtils.getMyLocalIPv4() ||
        senderInfo.address === "127.0.0.1"
      ) {
        return;
      }

      const dataDecrypt = this.crypto.decrypt("" + buf);
      const data = JSON.parse(dataDecrypt);
      if (data.code === ECode.ACK) {
        if (!this.carnet.map((el) => el.ip).includes(data.content.user.ip)) {
          this.carnet.push(data.content.user);
        }
      }
      if (data.code === ECode.HELLO) {
        this.server.send(
          this.crypto.encrypt(
            JSON.stringify({
              code: ECode.ACK,
              content: {
                user: {
                  pseudo: this.config.pseudo,
                  ip: NetUtils.getMyLocalIPv4(),
                },
              } as UserMessage,
            })
          ),
          this.port,
          senderInfo.address
        );
        return;
      }
      this.event.emit(CommunicationEvent.MESSAGE, data.content);
    });

    this.server.on("listening", () => {
      this.server.setBroadcast(true);
      this.event.emit(CommunicationEvent.LISTENING);
    });

    this.server.on("close", () => {
      this.server.close();
      this.event.emit(CommunicationEvent.CLOSE);
    });

    this.server.on("error", (err) => {
      this.server.close();
      this.event.emit(CommunicationEvent.ERROR, err);
    });

    this.server.bind(this.port);
  }

  public sendMessage(data: string): void {
    const jsonData = {
      code: ECode.MESSAGE,
      content: `${this.config.pseudo} : ${data}`,
    };
    const stringifyJson = JSON.stringify(jsonData);
    const encryptedData = this.crypto.encrypt(stringifyJson);
    for (const user of this.carnet) {
      if (user.ip === NetUtils.getMyLocalIPv4()) continue;
      this.server.send(encryptedData, this.port, user.ip, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }

  public async netScan(): Promise<UserInfo[]> {
    this.carnet = [];
    const hash = this.crypto.encrypt(
      JSON.stringify({ code: ECode.HELLO, content: "" })
    );
    this.server.send(hash, this.port, NetUtils.getBroadcastIPv4());
    return await new Promise(async (resolve, reject) => {
      setTimeout(() => {
        resolve(this.carnet);
      }, 2000);
    });
  }
}
