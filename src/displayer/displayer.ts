export interface Displayer {
  print(data: string): string;
  receiveMessage(data: string): string;
}
