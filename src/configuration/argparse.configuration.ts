import { RequireArgParamsError } from "./argparse.configuration.error";
import { Configuration } from "./configuration";

export class ArgParseConfig implements Configuration {
  pseudo?: string;
  room?: string;
  silent?: boolean;

  load(): void {
    let pos = process.argv.indexOf("-p");
    this.pseudo = pos === -1 ? "" : process.argv[pos + 1].toUpperCase();

    pos = process.argv.indexOf("-r");
    this.room = pos === -1 ? "" : process.argv[pos + 1].toUpperCase();

    pos = process.argv.indexOf("-s");
    this.silent = pos === -1;

    if (!this.pseudo) {
      throw new RequireArgParamsError("-p");
    }
  }
}
