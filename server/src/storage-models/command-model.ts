import type { DataValidatorResponse } from "../fileManager";
import { FileManager } from "../fileManager";
import { logger } from "../logger";
import { hasOwnProperty } from "../utils/hasOwnProperty";
import { timestampProperties, type Timestamp } from "./timestamp-model";

export interface Command extends Timestamp {
  command: string[];
  commandId: string;
  cooldown: number;
  description: string;
  message: string;
  timesUsed: number;
  privileged?: boolean;
  hidden?: boolean;
  mustBeUser?: string[];
}

const commandProperties = [
  "command",
  "commandId",
  "cooldown",
  "description",
  "message",
  "timesUsed",
];
const optionalCommandProperties = ["hidden", "privileged", "mustBeUser"];

const fileName = "commands.json";

const commandValidator = (data: unknown): DataValidatorResponse => {
  let response: DataValidatorResponse = "valid";

  if (Array.isArray(data)) {
    if (data.length === 0) {
      response = "valid";
    }

    for (const command of data as unknown[]) {
      if (typeof command !== "object") {
        response = "invalid";
      }

      for (const property of [
        ...commandProperties,
        ...optionalCommandProperties,
        ...timestampProperties,
      ]) {
        if (hasOwnProperty(command, property)) {
          switch (property) {
            case "command":
              if (!Array.isArray(command.command)) {
                logger.error(
                  `Invalid command format, property ${property} must be an array`,
                );
                response = "invalid";
              } else {
                if (
                  !command.command.every(
                    (command) => typeof command === "string",
                  )
                ) {
                  logger.error(
                    `Invalid command format, property ${property} must be an array of strings`,
                  );
                  response = "invalid";
                }
              }
              break;
            case "commandId":
              if (typeof command.commandId !== "string") {
                logger.error(
                  `Invalid command format, property ${property} must be a string`,
                );
                response = "invalid";
              }
              break;
            case "cooldown":
              if (typeof command.cooldown !== "number") {
                logger.error(
                  `Invalid command format, property ${property} must be a number`,
                );
                response = "invalid";
              }
              break;
            case "description":
              if (typeof command.description !== "string") {
                logger.error(
                  `Invalid command format, property ${property} must be a string`,
                );
                response = "invalid";
              }
              break;
            case "message":
              if (typeof command.message !== "string") {
                logger.error(
                  `Invalid command format, property ${property} must be a string`,
                );
                response = "invalid";
              }
              break;
            case "timesUsed":
              if (typeof command.timesUsed !== "number") {
                logger.error(
                  `Invalid command format, property ${property} must be a number`,
                );
                response = "invalid";
              }
              break;
            case "createdAt":
            case "updatedAt":
              if (typeof command[property] !== "string") {
                logger.error(
                  `Invalid command format, property ${property} must be a string`,
                );
                response = "invalid";
              }
              break;
            case "hidden":
            case "privileged":
              if (typeof command[property] !== "boolean") {
                logger.error(
                  `Invalid command format, property ${property} must be a boolean`,
                );
                response = "invalid";
              }
              break;
            case "mustBeUser":
              if (!Array.isArray(command.mustBeUser)) {
                logger.error(
                  `Invalid command format, property ${property} must be an array`,
                );
                response = "invalid";
              } else {
                if (
                  !command.mustBeUser.every(
                    (command) => typeof command === "string",
                  )
                ) {
                  logger.error(
                    `Invalid command format, property ${property} must be an array of strings`,
                  );
                  response = "invalid";
                }
              }
              break;
            default:
              logger.error(
                `Invalid command format, unknown property ${JSON.stringify(
                  property,
                )}`,
              );
              response = "invalid";
          }
        } else {
          if (optionalCommandProperties.includes(property)) {
            continue;
          }
          logger.error(`Invalid command format, missing property ${property}`);
          response = "invalid";
        }
      }

      return "valid";
    }
  } else {
    response = "invalid";
  }

  return response;
};

export class CommandModel {
  private static instance: CommandModel;

  private fileManager: FileManager<Command>;
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
    return [...this.commands];
  }

  public findOneByCommandId(commandId: string): Command | null {
    const command = this.commands.find(
      (command) => command.commandId === commandId,
    );
    if (!command) {
      return null;
    }
    return command;
  }

  public findOneByCommandAlias(commandAlias: string): Command | null {
    const commandFound = this.commands.find((command) =>
      command.command.includes(commandAlias),
    );
    if (!commandFound) {
      return null;
    }
    return commandFound;
  }

  public saveOne(command: Command): void {
    const index = this.commands.findIndex(
      (u) => u.commandId === command.commandId,
    );
    if (index === -1) {
      this.commands.push(command);
    } else {
      this.commands[index] = command;
    }
    this.fileManager.saveData(this.commands);
  }

  public deleteOne(command: Command): void {
    const index = this.commands.findIndex(
      (u) => u.commandId === command.commandId,
    );
    if (index !== -1) {
      this.commands.splice(index, 1);
      this.fileManager.saveData(this.commands);
    } else {
      logger.error(`Unable to delete: command ${command.commandId} not found`);
    }
  }

  public increaseTimesUsed(command: Command): void {
    const index = this.commands.findIndex(
      (u) => u.commandId === command.commandId,
    );
    if (index !== -1) {
      this.commands[index].timesUsed++;
      this.fileManager.saveData(this.commands);
    } else {
      logger.error(
        `Unable to increase times used: command ${command.commandId} not found`,
      );
    }
  }
}

export const Commands = CommandModel.getInstance();
