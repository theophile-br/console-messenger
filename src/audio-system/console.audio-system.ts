import { AudioSystem } from "./audio-system";

export class ConsoleAudioSystem implements AudioSystem {
  bell(): void {
    process.stdout.write("\x07");
  }
  play(): void {
    throw new Error("Method not implemented.");
  }
}
