import { FileManager } from '../fileManager';
import { logger } from '../logger';
import { hasOwnProperty } from '../utils/hasOwnProperty';
import { timestampProperties, type Timestamp } from './timestamp-model';

export interface Command extends Timestamp {
  command: string[];
  commandId: string;
  cooldown: number;
  description: string;
  message: string;
  timesUsed: number;
}

const commandProperties = ['command', 'commandId', 'cooldown', 'description', 'message', 'timesUsed'] as const;

const fileName = 'commands.json';

const commandValidator = (data: unknown): data is Command[] => {
  if (Array.isArray(data)) {
    return data.every((command: unknown) => {
      if (typeof command !== 'object') {
        return false;
      }

      for (const property of [...commandProperties, ...timestampProperties]) {
        if (hasOwnProperty(command, property)) {
          switch (property) {
            case 'command':
              if (!Array.isArray(command.command)) {
                logger.error(`Invalid command format, property ${property} must be an array`);
                return false;
              }
              if (!command.command.every((command) => typeof command === 'string')) {
                logger.error(`Invalid command format, property ${property} must be an array of strings`);
                return false;
              }
              break;
            case 'commandId':
              if (typeof command.commandId !== 'string') {
                logger.error(`Invalid command format, property ${property} must be a string`);
                return false;
              }
              break;
            case 'cooldown':
              if (typeof command.cooldown !== 'number') {
                logger.error(`Invalid command format, property ${property} must be a number`);
                return false;
              }
              break;
            case 'description':
              if (typeof command.description !== 'string') {
                logger.error(`Invalid command format, property ${property} must be a string`);
                return false;
              }
              break;
            case 'message':
              if (typeof command.message !== 'string') {
                logger.error(`Invalid command format, property ${property} must be a string`);
                return false;
              }
              break;
            case 'timesUsed':
              if (typeof command.timesUsed !== 'number') {
                logger.error(`Invalid command format, property ${property} must be a number`);
                return false;
              }
              break;
            case 'createdAt':
            case 'updatedAt':
              if (typeof command[property] !== 'string') {
                logger.error(`Invalid command format, property ${property} must be a string`);
                return false;
              }
              break;
            default:
              logger.error(`Invalid command format, unknown property ${JSON.stringify(property)}`);
              return false;
          }
        } else {
          logger.error(`Invalid command format, missing property ${property}`);
          return false;
        }
      }

      return true;
    });
  }
  return false;
};

export class CommandModel {
  private static instance: CommandModel;

  private fileManager: FileManager<Command[]>;
  private commands: Command[] = [];
  constructor() {
    this.fileManager = new FileManager(fileName, commandValidator);
    this.commands = this.fileManager.loadData();
  }

  public static getInstance(): CommandModel {
    if (!CommandModel.instance) {
      CommandModel.instance = new CommandModel();
    }
    return CommandModel.instance;
  }

  get data(): Command[] {
    return this.commands;
  }

  public findOneByCommandId(commandId: string): Command | null {
    const command = this.commands.find((command) => command.commandId === commandId);
    if (!command) {
      return null;
    }
    return command;
  }

  public findOneByCommandAlias(commandAlias: string): Command | null {
    const commandFound = this.commands.find((command) => command.command.includes(commandAlias));
    if (!commandFound) {
      return null;
    }
    return commandFound;
  }

  public saveOne(command: Command): void {
    const index = this.commands.findIndex((u) => u.commandId === command.commandId);
    if (index === -1) {
      this.commands.push(command);
    } else {
      this.commands[index] = command;
    }
    this.fileManager.saveData(this.commands);
  }

  public deleteOne(command: Command): void {
    const index = this.commands.findIndex((u) => u.commandId === command.commandId);
    if (index !== -1) {
      this.commands.splice(index, 1);
      this.fileManager.saveData(this.commands);
    } else {
      logger.error(`Unable to delete: command ${command.commandId} not found`);
    }
  }

  public increaseTimesUsed(command: Command): void {
    const index = this.commands.findIndex((u) => u.commandId === command.commandId);
    if (index !== -1) {
      this.commands[index].timesUsed++;
      this.fileManager.saveData(this.commands);
    } else {
      logger.error(`Unable to increase times used: command ${command.commandId} not found`);
    }
  }
}

export const Commands = CommandModel.getInstance();
