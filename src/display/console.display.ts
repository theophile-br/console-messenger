import { Display } from "./display";
import { UserInput } from "../user-input/user-input";

export class ConsoleDisplay implements Display {
  constructor(private userInput: UserInput) {}

  public receiveMessage(message: string): string {
    this.userInput.cut();
    this.print(message);
    this.userInput.paste();
    return message;
  }

  public print(data: string): string {
    console.log(data);
    return data;
  }
}
