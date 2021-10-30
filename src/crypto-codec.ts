import crypto from "crypto";

export default class CryptoCodec {
  private static algorithm = "aes-256-ctr";
  private static iv = crypto.randomBytes(16);
  public static SECRET_KEY = "vOVH6sAzeNWjRRIqCc7rdgs01LwHzfR3";

  public static encrypt = (data: string): Hash => {
    const cipher = crypto.createCipheriv(
      CryptoCodec.algorithm,
      CryptoCodec.SECRET_KEY,
      CryptoCodec.iv
    );
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return {
      iv: CryptoCodec.iv.toString("hex"),
      content: encrypted.toString("hex"),
    };
  };

  public static decrypt = (hash: Hash): string => {
    const decipher = crypto.createDecipheriv(
      CryptoCodec.algorithm,
      CryptoCodec.SECRET_KEY,
      Buffer.from(hash.iv, "hex")
    );
    const decrpyted = Buffer.concat([
      decipher.update(Buffer.from(hash.content, "hex")),
      decipher.final(),
    ]);
    return decrpyted.toString();
  };
}

export interface Hash {
  iv: string;
  content: string;
}
