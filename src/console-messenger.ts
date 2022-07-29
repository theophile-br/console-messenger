import {IConfigurationLoader } from "./argparse.config";
import { BroadcastCommunication } from "./broadcast.communication";
import readline from "readline";
import { stdin, stdout} from "process"
import { CryptoCodec } from "./cipher.crypto";
const rl = readline.createInterface( stdin, stdout );
export class ConsoleMessenger {
    private config: IConfigurationLoader;
    private communication: BroadcastCommunication;
    private crypto: CryptoCodec;

    constructor( ConfigClass:new () => IConfigurationLoader,  CommunicationClass: new (crypto:any) => BroadcastCommunication,  CryptoClass: new () =>CryptoCodec){
        this.config = new ConfigClass()
        this.crypto = new CryptoClass()
        this.communication = new CommunicationClass(crypto)
    }

    public async start():Promise<void> {
        this.config.load()
        rl.on("line", this.onEnter);

    }

    private onEnter(data: string)  {
        readline.moveCursor(process.stdin, 0, -1);
        readline.clearLine(process.stdin, 0);
      
        if (data[0] === "/") {
            this.runCommande(data);
        } else {
            this.communication.sendMessage(data)
            console.log(`${"YOU"} : ${data}`);
        }
      }

      private runCommande(data: string){
        if (data === "/scan") {
            //netscan();
            return;
          }
      }
}