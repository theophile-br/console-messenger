import { Displayer } from "./displayer";

export class TerminalDisplayer extends Displayer {
  public print(data: string): string {
    console.log(data);
    return data;
  }
}
