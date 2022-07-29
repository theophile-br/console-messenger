import { ArgParseConfig } from "./configuration/argparse.configuration";
import { BroadcastCommunication } from "./communication/broadcast.communication";
import { ConsoleMessenger } from "./console-messenger";
import { CipherCrypto } from "./cryptography/cipher.cryptography";

const app = new ConsoleMessenger(
  ArgParseConfig,
  CipherCrypto,
  BroadcastCommunication
);

app.start();
