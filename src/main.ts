import { ArgParseConfig } from "./argparse.config";
import { BroadcastCommunication } from "./broadcast.communication";
import { ConsoleMessenger } from "./console-messenger";
import { CipherCrypto } from "./cipher.crypto";

const app = new ConsoleMessenger( ArgParseConfig, BroadcastCommunication, CipherCrypto);

app.start()