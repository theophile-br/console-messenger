export class RequireArgParamsError extends Error {
  constructor(parameter: string) {
    super(`arg ${parameter} is required`);
  }
}
