export abstract class ICommunication {
    send():void {
      throw new Error("Methode Not Implemented")
    }
    onReceive():void {
      throw new Error("Methode Not Implemented")
    }
    started():void {
      throw new Error("Methode Not Implemented")
    }
}
import dgram from "dgram"
import { CryptoCodec } from "./cipher.crypto";
import { NetUtils } from "./net.utils";

const CODE = {
  HELLO: "HELLO",
  MESSAGE: "MSG",
};
const port = 41234;


// TODO: https://dev.to/swensson/create-a-p2p-network-with-node-from-scratch-1pah
export class BroadcastCommunication {
    server = dgram.createSocket("udp4");
    public carnet = []

    constructor(private crypto: CryptoCodec){
        this.server.on("message",(buf, senderInfo) => {
            if (
                senderInfo.address === NetUtils.getMyLocalIPv4() ||
                senderInfo.address === "127.0.0.1"
              ) {
                return;
              }
        })

        this.server.on("listening", async () => {

        });

        this.server.on("close", () => {
            console.log("program stop");
            process.exit();
          });
        
          this. server.on("error", (err) => {
            console.log(`server error:\n${err.stack}`);
            this.server.close();
          });
    }

    public sendMessage(data:string): void{
      const encriptedData = this.crypto.encrypt({ code: CODE.MESSAGE, content: `${pseudo} : ${data}` })
      for (const dest of this.carnet) {
        if (dest === NetUtils.getMyLocalIPv4()) continue;
      this.server.send(encriptedData, port, dest, (err) => {
        if (err) {
          console.log(err);
        }
      });
  }
}

    public onListening() {

    }

    public onMessage() {

    }

    public onClose() {

    }

    public onError() {

    }


}