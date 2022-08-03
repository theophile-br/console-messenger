import { expect } from "chai";
import { CipherCrypto } from "../src/cryptography/cipher.cryptography";

describe("Cryptography", () => {
  describe("Cipher Cryptography", () => {
    it("should be able to crypt", () => {
      //Given
      const originalMessage = "Bonjour ! Comment ça va ?";
      const crypto = new CipherCrypto();
      //When
      const encryptedMessage = crypto.encrypt(originalMessage);
      //Then
      expect(originalMessage).to.not.be.eq(encryptedMessage);
    });

    it("should be able to crypt and decrypt", () => {
      //Given
      const originalMessage = "Bonjour ! Comment ça va ?";
      const crypto = new CipherCrypto();
      //When
      const encryptedMessage = crypto.encrypt(originalMessage);
      const decryptedMessage = crypto.decrypt(encryptedMessage);
      //Then
      expect(decryptedMessage).to.be.eq(originalMessage);
    });
  });
});
