import { ArgParseConfig } from "./configuration/argparse.configuration";
import { BroadcastCommunication } from "./communication/broadcast.communication";
import { ConsoleMessenger } from "./console-messenger";
import { CipherCrypto } from "./cryptography/cipher.cryptography";
import { TerminalDisplayer } from "./displayer/terminal.displayer";

const displayer = new TerminalDisplayer();
const config = new ArgParseConfig();
const crypto = new CipherCrypto();
const communication = new BroadcastCommunication(crypto, config);

const app = new ConsoleMessenger(config, communication, crypto, displayer);

app.start();
