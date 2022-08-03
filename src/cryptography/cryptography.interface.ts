export interface ICryptography {
  encrypt(data: string): string;
  decrypt(hash: string): string;
}
