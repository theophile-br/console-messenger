import { UserInput } from "./user-input";
import readline from "readline";
import { stdin, stdout } from "process";
import { EventEmitter } from "stream";
import { UserInputEvent } from "./user-input.enum";

export class ConsoleUserInput implements UserInput {
  public cursorPosition: number = 0;
  public memory: string = "";
  public readonly event: EventEmitter = new EventEmitter();
  private rl = readline.createInterface(stdin, stdout);

  constructor() {
    this.rl.on("line", (data: string) =>
      this.event.emit(UserInputEvent.ENTER_KEYDOWN, data)
    );
  }

  cut(): void {
    this.memory = this.rl.line;
    (this.rl as any).line = ""; //TODO: Change this ugly thing
    readline.clearLine(process.stdin, 0);
    readline.cursorTo(process.stdin, 0);
    this.rl.pause();
  }

  paste(): void {
    this.rl.write(this.memory);
    this.rl.resume();
  }

  clearLine(): void {
    readline.moveCursor(process.stdin, 0, -1);
    readline.clearLine(process.stdin, 0);
  }
}
