import crypto from "crypto";
import { Cryptography as Cryptography } from "./cyptography";

type CipherData = {
  iv: string;
  content: string;
};

export class CipherCrypto extends Cryptography {
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
    const decripted = Buffer.concat([
      decipher.update(Buffer.from(hash.content, "hex")),
      decipher.final(),
    ]);
    return decripted.toString();
  }
}
