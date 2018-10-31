import { LogPlainRecord } from './definitions';

export class LogRecord {
  public readonly time: string;

  constructor(public readonly id: string, public readonly message: string, public readonly extraData?) {
    this.time = new Date().toISOString();
  }

  getContent(): LogPlainRecord {
    const result: LogPlainRecord = { time: this.time, message: this.message, id: this.id };

    if (this.extraData) {
      result.extraData = this.extraData;
    }

    return result;
  }
}
