export abstract class Cryptography {
  encrypt(data: string): string {
    throw new Error("Method Not Implemented");
  }
  decrypt(hash: string): string {
    throw new Error("Method Not Implemented");
  }
}
