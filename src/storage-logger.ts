import { Loggable, LogLevel, LogPlainRecord } from './definitions';
import { LogRecord } from './log-record';

export class StorageLogger implements Loggable {
  private content = [];

  log(logRecord: LogRecord, level: LogLevel = LogLevel.ALL) {
    this.content.push(logRecord);
  }

  getContent(): LogPlainRecord[] {
    return this.content.map(record => record.getContent());
  }
}
