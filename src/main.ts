import { ArgParseConfig } from "./configuration/argparse.configuration";
import { BroadcastCommunication } from "./communication/broadcast.communication";
import { ConsoleMessenger } from "./console-messenger";
import { CipherCrypto } from "./cryptography/cipher.cryptography";
import { ConsoleDisplayer } from "./displayer/console.displayer";
import { ConsoleUserInput } from "./user-input/console.user-input";

const userInput = new ConsoleUserInput();
const displayer = new ConsoleDisplayer(userInput);
const config = new ArgParseConfig();
const crypto = new CipherCrypto();
const communication = new BroadcastCommunication(crypto, config);

const app = new ConsoleMessenger(config, communication, displayer, userInput);

app.start();
