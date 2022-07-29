export abstract class Cryptography {
  encrypt(data: string): string {
    throw new Error("Methode Not Implemented");
  }
  decrypt(hash: string): string {
    throw new Error("Methode Not Implemented");
  }
}
