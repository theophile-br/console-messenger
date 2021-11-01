import CryptoCodec from "../src/crypto-codec"

test("encrypt correctly", () => {
  const hash = CryptoCodec.encrypt("COUCOU")
  expect(hash.content).not.toBe("COUCOU")
});

test("decrypt eq", () => {
  const hash = CryptoCodec.encrypt("COUCOU")
  expect(CryptoCodec.decrypt(hash)).toBe("COUCOU")});

  test("decrypt not eq", () => {
    const hash = CryptoCodec.encrypt("COUCOU")
    expect(CryptoCodec.decrypt(hash)).not.toBe("AU REVOIR")});
  