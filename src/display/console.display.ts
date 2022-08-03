import { IDisplay } from "./display.interface";
import { IUserInput } from "../user-input/user-input.interface";

export class ConsoleDisplay implements IDisplay {
  constructor(private userInput: IUserInput) {}

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
