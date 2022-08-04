import crypto from "crypto";
import { SecretWordExceedThe32CharLimitError } from "./cipher.cryptography.error";
import { ICryptography as ICryptography } from "./cryptography.interface";

type CipherData = {
  iv: string;
  content: string;
};

export class CipherCrypto implements ICryptography {
  private algorithm = "aes-256-ctr";
  private SECRET_KEY = "vOVH6sAzeNWjRRIqCc7rgsd01LwHzfR3";
  private iv = crypto.randomBytes(16);

  encrypt(data: string): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.SECRET_KEY,
      this.iv
    );
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return JSON.stringify({
      iv: this.iv.toString("hex"),
      content: encrypted.toString("hex"),
    });
  }

  decrypt(data: string): string {
    const hash: CipherData = JSON.parse(data) as CipherData;
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.SECRET_KEY,
      Buffer.from(hash.iv, "hex")
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(hash.content, "hex")),
      decipher.final(),
    ]);
    return decrypted.toString();
  }

  setupSecret(word: string): string {
    const sizeOfWord = word.length;
    if (sizeOfWord > 32) {
      throw new SecretWordExceedThe32CharLimitError();
    }
    this.SECRET_KEY =
      word + this.SECRET_KEY.slice(word.length, this.SECRET_KEY.length);

    return this.SECRET_KEY;
  }
}
