import { ArgParseConfig } from "./configuration/argparse.configuration";
import { BroadcastCommunication } from "./communication/broadcast.communication";
import { ConsoleMessenger } from "./console-messenger";
import { CipherCrypto } from "./cryptography/cipher.cryptography";
import { TerminalDisplayer } from "./displayer/terminal.displayer";

const app = new ConsoleMessenger(
  TerminalDisplayer,
  ArgParseConfig,
  CipherCrypto,
  BroadcastCommunication
);

app.start();
