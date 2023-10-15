import type { DataValidatorResponse } from "../fileManager";
import { FileManager } from "../fileManager";
import { logger } from "../logger";
import { hasOwnProperty } from "../utils/hasOwnProperty";

export interface IntervalCommand {
  tickInterval: number; // number of ticks between each time the command is run
  currentTick: number; // number of ticks since the command was last run
  startDelay: number; // number of ticks to wait before running the command for the first time
  actions: {
    message: string; // message to send to chat when the redeem is used, can include all the same variables as command message
    command: string; // command to run when the redeem is used
    commandParams: string; // command to run when the redeem is used,
  }[];
  mustBeStreaming: boolean; // whether the command can only be run when the stream is live
}

const intervalCommandProperties = [
  "tickInterval",
  "startDelay",
  "actions",
  "mustBeStreaming",
];
const intervalCommandActionProperties = ["message", "command", "commandParams"];

const fileName = "intervalCommands.json";

const intervalCommandValidator = (data: unknown): DataValidatorResponse => {
  let response: DataValidatorResponse = "valid";

  if (Array.isArray(data)) {
    if (data.length === 0) {
      response = "valid";
    }

    for (const intervalCommand of data as unknown[]) {
      if (typeof intervalCommand !== "object") {
        response = "invalid";
      }

      for (const property of [...intervalCommandProperties]) {
        if (hasOwnProperty(intervalCommand, property)) {
          switch (property) {
            case "tickInterval":
              if (typeof intervalCommand.tickInterval !== "number") {
                logger.error(
                  `Invalid interval command format, property ${property} must be a number`,
                );
                response = "invalid";
              }
              break;
            case "startDelay":
              if (typeof intervalCommand.startDelay !== "number") {
                logger.error(
                  `Invalid interval command format, property ${property} must be a number`,
                );
                response = "invalid";
              }
              break;
            case "mustBeStreaming":
              if (typeof intervalCommand.mustBeStreaming !== "boolean") {
                logger.error(
                  `Invalid interval command format, property ${property} must be a boolean`,
                );
                response = "invalid";
              }
              break;
            case "actions":
              if (!Array.isArray(intervalCommand.actions)) {
                logger.error(
                  `Invalid interval command format, property ${property} must be an array`,
                );
                response = "invalid";
              } else {
                if (
                  !intervalCommand.actions.every(
                    (action: unknown) => typeof action === "object",
                  )
                ) {
                  logger.error(
                    `Invalid interval command format, property ${property} must be an array of objects`,
                  );
                  response = "invalid";
                }
                if (
                  !intervalCommand.actions.every((action: unknown) =>
                    intervalCommandActionProperties.every((actionProperty) =>
                      hasOwnProperty(action, actionProperty),
                    ),
                  )
                ) {
                  logger.error(
                    `Invalid interval command format, property ${property} must be an array of objects`,
                  );
                  response = "invalid";
                }
              }
              break;
            default:
              logger.error(
                `Invalid interval command format, unknown property ${property}`,
              );
              response = "invalid";
          }
        } else {
          logger.error(
            `Invalid channel point redeem format, missing property ${property}`,
          );
          response = "invalid";
        }
      }
    }
  } else {
    response = "invalid";
  }

  return response;
};

export class IntervalCommandModel {
  private static instance: IntervalCommandModel;

  private fileManager: FileManager<IntervalCommand>;
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
    return [...this.intervalCommands];
  }
}

export const IntervalCommands = IntervalCommandModel.getInstance();
