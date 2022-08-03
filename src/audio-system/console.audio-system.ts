import { IAudioSystem } from "./audio-system.interface";

export class ConsoleAudioSystem implements IAudioSystem {
  bell(): void {
    process.stdout.write("\x07");
  }
  play(): void {
    throw new Error("Method not implemented.");
  }
}
