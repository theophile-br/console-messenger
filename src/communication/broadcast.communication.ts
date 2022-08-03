import dgram from "dgram";
import { Configuration } from "../configuration/configuration";
import { Cryptography } from "../cryptography/cyptography";
import { NetUtils } from "../utils/net.utils";
import { CommunicationEvent } from "./communication.enum";
import { Communication } from "./communication";
import { EventEmitter } from "stream";

const CODE = {
  HELLO: "HELLO",
  MESSAGE: "MSG",
};

export class BroadcastCommunication implements Communication {
  private server = dgram.createSocket("udp4");
  private port = 41234;
  private carnet: string[] = [];
  public readonly event: EventEmitter = new EventEmitter();

  constructor(private crypto: Cryptography, private config: Configuration) {
    this.server.on("message", (buf, senderInfo) => {
      if (
        senderInfo.address === NetUtils.getMyLocalIPv4() ||
        senderInfo.address === "127.0.0.1"
      ) {
        return;
      }
      if (!this.carnet.includes(senderInfo.address)) {
        this.carnet.push(senderInfo.address);
      }
      const dataDecrypt = this.crypto.decrypt("" + buf);
      const data = JSON.parse(dataDecrypt);
      if (data.code === CODE.HELLO) {
        this.server.send(
          this.crypto.encrypt(
            JSON.stringify({
              code: CODE.MESSAGE,
              content: `${this.config.pseudo} is here !`,
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
      code: CODE.MESSAGE,
      content: `${this.config.pseudo} : ${data}`,
    };
    const stringifyJson = JSON.stringify(jsonData);
    const encriptedData = this.crypto.encrypt(stringifyJson);
    for (const dest of this.carnet) {
      if (dest === NetUtils.getMyLocalIPv4()) continue;
      this.server.send(encriptedData, this.port, dest, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  }

  public netScan(): void {
    const hash = this.crypto.encrypt(
      JSON.stringify({ code: CODE.HELLO, content: "" })
    );
    this.server.send(hash, this.port, NetUtils.getBroadcastIPv4());
  }
}
