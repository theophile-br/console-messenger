import { AudioSystem } from "./audio-system";

export class ConsoleAudioSystem implements AudioSystem {
  bell(): void {
    console.log("\u0007");
  }
  play(): void {
    throw new Error("Method not implemented.");
  }
}
