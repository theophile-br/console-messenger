import { ArgParseConfig } from "./config/argparse.config";
import { BroadcastCommunication } from "./communication/broadcast.communication";
import { ConsoleMessenger } from "./console-messenger";
import { CipherCrypto } from "./cryptography/cipher.crypto";

const app = new ConsoleMessenger(
  ArgParseConfig,
  CipherCrypto,
  BroadcastCommunication
);

app.start();
