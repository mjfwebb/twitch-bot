import { FileManager } from '../fileManager';
import { logger } from '../logger';
import { hasOwnProperty } from '../utils/hasOwnProperty';

export interface IntervalCommand {
  tickInterval: number; // number of ticks between each time the command is run
  currentTick: number; // number of ticks since the command was last run
  startDelay: number; // number of ticks to wait before running the command for the first time
  actions: {
    message: string; // message to send to chat when the redeem is used, can include all the same variables as command message
    command: string; // command to run when the redeem is used
    commandParams: string; // command to run when the redeem is used,
  }[];
}

const intervalCommandProperties = ['tickInterval', 'startDelay', 'actions'];
const intervalCommandActionProperties = ['message', 'command', 'commandParams'];

const fileName = 'intervalCommands.json';

const intervalCommandValidator = (data: unknown): data is IntervalCommand[] => {
  if (Array.isArray(data)) {
    return data.every((intervalCommand: unknown) => {
      if (typeof intervalCommand !== 'object') {
        return false;
      }

      for (const property of [...intervalCommandProperties]) {
        if (hasOwnProperty(intervalCommand, property)) {
          switch (property) {
            case 'tickInterval':
              if (typeof intervalCommand.tickInterval !== 'number') {
                logger.error(`Invalid interval command format, property ${property} must be a number`);
                return false;
              }
              break;
            case 'startDelay':
              if (typeof intervalCommand.startDelay !== 'number') {
                logger.error(`Invalid interval command format, property ${property} must be a number`);
                return false;
              }
              break;
            case 'actions':
              if (!Array.isArray(intervalCommand.actions)) {
                logger.error(`Invalid interval command format, property ${property} must be an array`);
                return false;
              }
              if (!intervalCommand.actions.every((action: unknown) => typeof action === 'object')) {
                logger.error(`Invalid interval command format, property ${property} must be an array of objects`);
                return false;
              }
              if (
                !intervalCommand.actions.every((action: unknown) =>
                  intervalCommandActionProperties.every((actionProperty) => hasOwnProperty(action, actionProperty)),
                )
              ) {
                logger.error(`Invalid interval command format, property ${property} must be an array of objects`);
                return false;
              }
              break;
            default:
              logger.error(`Invalid interval command format, unknown property ${property}`);
              return false;
          }
        } else {
          logger.error(`Invalid channel point redeem format, missing property ${property}`);
          return false;
        }
      }

      return true;
    });
  }
  return false;
};

export class IntervalCommandModel {
  private static instance: IntervalCommandModel;

  private fileManager: FileManager<IntervalCommand[]>;
  private intervalCommands: IntervalCommand[] = [];
  constructor() {
    this.fileManager = new FileManager(fileName, intervalCommandValidator);
    this.intervalCommands = this.fileManager.loadData();
  }

  public static getInstance(): IntervalCommandModel {
    if (!IntervalCommandModel.instance) {
      IntervalCommandModel.instance = new IntervalCommandModel();
    }
    return IntervalCommandModel.instance;
  }

  get data(): IntervalCommand[] {
    return this.intervalCommands;
  }
}

export const IntervalCommands = IntervalCommandModel.getInstance();
