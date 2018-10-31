import { LogPlainRecord } from './definitions';

export class LogRecord {
  public readonly time: number;

  constructor(public readonly id: string, public readonly message: string) {
    this.time = Date.now();
  }

  getContent(): LogPlainRecord {
    return { time: this.time, message: this.message, id: this.id };
  }
}
