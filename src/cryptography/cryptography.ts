export interface Cryptography {
  encrypt(data: string): string;
  decrypt(hash: string): string;
}
