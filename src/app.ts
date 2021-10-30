import CryptoCodec from "./crypto-codec";

class App {
  static main(): void {
    const hash = CryptoCodec.encrypt("Coucou");
    const string = CryptoCodec.decrypt(hash);
  }
}

App.main();
