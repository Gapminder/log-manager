# log-manager

A module for passing diagnostics messages between different parts of the tools page ecosystem

## Install it
`npm i gapminder-log-manager`

## API

The base functionality of this module is located in the LogManager class.

So, simple example that illustrates how to create and use LogManager is following

```typescript
import { LogManager, LogLevel } from 'gapminder-log-manager';

const logger = new LogManager('who am I', LogLevel.ALL);

logger.addOutputTo(console);

logger.log('message 1');
logger.log('message 2', LogLevel.REPLICATION, 'additional data for message 2');
```

The output is the following:

```
LogRecord {
  id: 'who am I',
  message: 'message 1',
  extraData: undefined,
  time: '2018-11-01T14:19:16.824Z' }
LogRecord {
  id: 'who am I',
  message: 'message 2',
  extraData: 'additional data for message 2',
  time: '2018-11-01T14:19:16.826Z' }
```

### LogManager class

Constructor of this class takes two parameters:

1.  `Logger ID` is a string that describes this logger or its module. This parameter is especially actual when we are using logger combination.
2.  `Logging Level` indicates what kind of messages would be appropriate for the instance of LogManager class. `LogLevel` enum will be described a little bit later.

Also `LogManager` class has two methods:

* `addOutputTo` is a very important method because without using it the logging system will not be working. It takes only one parameter. It can be any object with mandatory `log` method that takes a least one parameter as message string. The simplest example of it is Javascript `console` (see example above). Apart from that `gapminder-log-manager` contains a special type of logging object `StorageLogger`. The main purpose of an instance of this class is the ability to collect all log data to the persistent storage (array).
* `log` method passes a message to LogManager. The method has 3 parameters:
  1. String message is mandatory
  2. LogLevel of the current message
  3. Extra data

  You can see more details in the example above.

### LogLevel

`LogLevel` in an enum that describes Log Level states. It has the following constant values:

* ERROR - error level
* REPLICATION - replication (notice) level
* DEBUG - debug level. Additional data using is preferable at this level.
* ALL - all of them

The main feature of LogLevel is an ability to combine them during `LogManager` instance creation. So if we need to work with, for example, REPLICATION and DEBUG at the same time you can construct your own level via `REPLICATION | DEBUG`.

Following examples illustrate some important cases regarding `LogLevel`.

Case 1.

```typescript
import { LogManager, LogLevel } from 'gapminder-log-manager';

const logger = new LogManager('who am I', LogLevel.ERROR);

logger.addOutputTo(console);

logger.log('message 1', LogLevel.DEBUG);
logger.log('message 2', LogLevel.REPLICATION, 'additional data for message 2');
```

In this case, an empty output should be given. The reason is simple. There is no any intersection between logger's LogLevel and LogLevels of the messages.

Case 2.

```typescript
import { LogManager, LogLevel } from 'gapminder-log-manager';

const logger = new LogManager('who am I', LogLevel.DEBUG | LogLevel.REPLICATION);

logger.addOutputTo(console);

logger.log('message 1', LogLevel.DEBUG);
logger.log('message 2', LogLevel.REPLICATION, 'additional data for message 2');
logger.log('message 3', LogLevel.ERROR);
```

The result should look like
```
LogRecord {
  id: 'who am I',
  message: 'message 1',
  extraData: undefined,
  time: '2018-11-02T11:44:29.234Z' }
LogRecord {
  id: 'who am I',
  message: 'message 2',
  extraData: 'additional data for message 2',
  time: '2018-11-02T11:44:29.237Z' }
```
Let's explain what happens. First of all, the logger is able to receive two kinds of messages: `DEBUG` or (| bitwise operator) `REPLICATION`. In the first `log` calls we are sending appropriate messages, but in the third case aren't (`ERROR`). That's why our logger processed the only first couple of them.

### Custom output

All of the previous examples are using Javascript `console` as output. But as far as previously said, method `addOutputTo` that should take any object with mandatory `log` method that takes a least one parameter as message string.


`gapminder-log-manager` has one useful custom logg object `StorageLogger`.

You can see its code  [here](https://github.com/Gapminder/log-manager/blob/master/src/storage-logger.ts).

Apart from `log` method it has an additional one: `getContent`. This method returns all log data at the same time by user request.

Let's look at:

```typescript
import { LogManager, LogLevel, StorageLogger } from 'gapminder-log-manager';

const logger = new LogManager('who am I', LogLevel.ALL);
const storageLogger = new StorageLogger();

logger.addOutputTo(storageLogger);

logger.log('message 1', LogLevel.ALL);
logger.log('message 2', LogLevel.REPLICATION, 'additional data for message 2');
logger.log('message 3', LogLevel.ERROR);

console.log(storageLogger.getContent());
```

Result is following:

```
[ { time: '2018-11-02T12:29:56.332Z',
    message: 'message 1',
    id: 'who am I' },
  { time: '2018-11-02T12:29:56.332Z',
    message: 'message 2',
    id: 'who am I',
    extraData: 'additional data for message 2' },
  { time: '2018-11-02T12:29:56.332Z',
    message: 'message 3',
    id: 'who am I' } ]
```

Pay attention that type of the result is an array and its content is stored in the `storageLogger` object.

Moreover, we can add more that one output to LogManager:

```typescript
import { LogManager, LogLevel, StorageLogger } from 'gapminder-log-manager';

const logger = new LogManager('who am I', LogLevel.ALL);
const storageLogger = new StorageLogger();

logger.addOutputTo(console);
logger.addOutputTo(storageLogger);

logger.log('message 1', LogLevel.ALL);
logger.log('message 2', LogLevel.REPLICATION, 'additional data for message 2');
logger.log('message 3', LogLevel.ERROR);

console.log('"storageLogger" content', storageLogger.getContent());
```

```
LogRecord {
  id: 'who am I',
  message: 'message 1',
  extraData: undefined,
  time: '2018-11-02T12:38:54.174Z' }
LogRecord {
  id: 'who am I',
  message: 'message 2',
  extraData: 'additional data for message 2',
  time: '2018-11-02T12:38:54.177Z' }
LogRecord {
  id: 'who am I',
  message: 'message 3',
  extraData: undefined,
  time: '2018-11-02T12:38:54.177Z' }
"storageLogger" content [ { time: '2018-11-02T12:38:54.177Z',
    message: 'message 1',
    id: 'who am I' },
  { time: '2018-11-02T12:38:54.177Z',
    message: 'message 2',
    id: 'who am I',
    extraData: 'additional data for message 2' },
  { time: '2018-11-02T12:38:54.177Z',
    message: 'message 3',
    id: 'who am I' } ]
```

Output before "storageLogger" point is related to Javascript `console` and rest of the output is related to `storageLogger` based output.

### Output sharing between modules

This feature is more complex and flexible.

Imagine, that we have 3 kinds of an object with own loggers and at the same time we need to combine their output:

```typescript
import { LogManager, LogLevel } from 'gapminder-log-manager';

class Child {
  logger: LogManager;

  constructor(public readonly externalLogManager) {
    this.logger = new LogManager('Child', LogLevel.ALL);
    this.logger.addOutputTo(externalLogManager);
    this.logger.log('Hi, Parent!');
  }
}

class Parent {
  logger: LogManager;
  child: Child;

  constructor(public readonly externalLogManager) {
    this.logger = new LogManager('Parent', LogLevel.ALL);
    this.logger.addOutputTo(externalLogManager);
    this.logger.log('Hi, Child!');
    this.child = new Child(externalLogManager);
  }
}

class GrandParent {
  logger: LogManager;
  parent: Parent;

  constructor(public readonly externalLogManager) {
    this.logger = new LogManager('GrandParent', LogLevel.ALL);
    this.logger.addOutputTo(externalLogManager);
    this.parent = new Parent(externalLogManager);
  }
}

const dialogs = new LogManager('who am I', LogLevel.ALL);

dialogs.addOutputTo(console);

const grandParent = new GrandParent(dialogs);

grandParent.logger.log('Hello, Parent!');
```

Output is following in this case:

```
LogRecord {
  id: 'Parent',
  message: 'Hi, Child!',
  extraData: undefined,
  time: '2018-11-02T13:26:30.726Z' }
LogRecord {
  id: 'Child',
  message: 'Hi, Parent!',
  extraData: undefined,
  time: '2018-11-02T13:26:30.729Z' }
LogRecord {
  id: 'GrandParent',
  message: 'Hello, Parent!',
  extraData: undefined,
  time: '2018-11-02T13:26:30.729Z' }
```

So, let's explain what happens.

First of all, the instance of `GrandParent` creates an instance of `Parent` and `Parent` instance, in turn, create an instance of `Child`. Apart from that `Parent` and `Child` instances call their log directly. And before they add "parent/external" (`this.logger.addOutputTo(externalLogManager);`) loggers to own logger. That's why we can see messages from all 3 objects at the result log output.
