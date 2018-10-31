import { LogRecord } from './log-record';

export enum LogLevel {
  ERROR = 0x1,
  REPLICATION = 0x2,
  DEBUG = 0x4,
  ALL = ERROR | REPLICATION | DEBUG
}

export interface Loggable {
  log(message: LogRecord | string, level?: LogLevel);
}

export type LogPlainRecord = {
  id: string;
  time: string;
  message: string;
  extraData?
}
