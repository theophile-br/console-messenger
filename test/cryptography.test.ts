import { expect } from "chai";
import { CipherCrypto } from "../src/cryptography/cipher.cryptography";
import { SecretWordExceedThe32CharLimitError } from "../src/cryptography/cipher.cryptography.error";

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
      const encryptedMessage = crypto.encrypt(originalMessage);
      //When
      const decryptedMessage = crypto.decrypt(encryptedMessage);
      //Then
      expect(decryptedMessage).to.be.eq(originalMessage);
    });

    it("should be able to setup and encrypt data with a new secret", () => {
      //Given
      const originalMessage = "Bonjour ! Comment ça va ?";
      const crypto = new CipherCrypto();
      //When
      crypto.setupSecret("MyNewSecret");
      const encryptedMessage = crypto.encrypt(originalMessage);
      const decryptedMessage = crypto.decrypt(encryptedMessage);
      //Then
      expect(decryptedMessage).to.be.eq(originalMessage);
    });

    it("shouldn't be able decrypt data after setup new secret", () => {
      //Given
      const originalMessage = "Bonjour ! Comment ça va ?";
      const crypto = new CipherCrypto();
      //When
      const encryptedMessageWithOldSecret = crypto.encrypt(originalMessage);
      crypto.setupSecret("MyNewSecret");
      const decryptedMessageWithOldSecret = crypto.decrypt(
        encryptedMessageWithOldSecret
      );
      //Then
      expect(decryptedMessageWithOldSecret).to.not.be.eq(originalMessage);
    });

    it("should throw SecretWordExceedThe32CharLimitError", () => {
      //Given
      const crypto = new CipherCrypto();
      //When
      const shouldThrow = () =>
        crypto.setupSecret("ThisSecretHaveMoreThan32CharAndItWillThrowAnError");
      //Then
      expect(shouldThrow).to.throw(SecretWordExceedThe32CharLimitError);
    });
  });
});
