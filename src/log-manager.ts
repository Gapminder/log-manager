import { Loggable, LogLevel } from './definitions';
import { LogRecord } from './log-record';

export class LogManager implements Loggable {
  private children: Loggable[] = [];

  constructor(private id: string, private currentLevel: LogLevel) {
  }

  addOutputTo(child: Loggable) {
    this.children.push(child);
  }

  log(message: LogRecord | string, requestedLevel: LogLevel = LogLevel.ERROR, extraData?) {
    if (message instanceof LogRecord) {
      this.children.map(listener => listener.log(message));
    } else if (typeof message === 'string') {
      if ((this.currentLevel & requestedLevel) !== requestedLevel) {
        return;
      }

      this.children.map(listener => listener.log(this.prepareLogRecord(message, extraData)));
    } else {
      throw Error('wrong log argument type');
    }
  }

  private prepareLogRecord(message: string, extraData?): LogRecord {
    return new LogRecord(this.id, message, extraData);
  }
}
