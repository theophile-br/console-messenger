import { Displayer } from "./displayer";
import { UserInput } from "../user-input/user-input";

export class ConsoleDisplayer implements Displayer {
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
