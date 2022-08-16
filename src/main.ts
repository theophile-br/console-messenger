import { ArgParseConfig } from "./configuration/argparse.configuration";
import { BroadcastCommunication } from "./communication/broadcast.communication";
import { ConsoleMessenger } from "./console-messenger";
import { CipherCrypto } from "./cryptography/cipher.cryptography";
import { ConsoleDisplay } from "./display/console.display";
import { ConsoleUserInput } from "./user-input/console.user-input";
import { ConsoleAudioSystem } from "./audio-system/console.audio-system";

const config = new ArgParseConfig();
const crypto = new CipherCrypto();
const communication = new BroadcastCommunication(crypto, config);
const userInput = new ConsoleUserInput();
const audioSystem = new ConsoleAudioSystem();
const display = new ConsoleDisplay(userInput);

const app = new ConsoleMessenger(
  config,
  communication,
  crypto,
  display,
  userInput,
  audioSystem
);

app.start();
