export class SecretWordExceedThe32CharLimitError extends Error {
  constructor() {
    super(`Secret word exceed the 32 char limit`);
  }
}
