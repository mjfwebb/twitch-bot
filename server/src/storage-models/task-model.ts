import { writeFileSync } from 'fs';
import type { DataValidatorResponse } from '../fileManager';
import { FileManager } from '../fileManager';
import { logger } from '../logger';
import type { ParsedMessageWithAllProps } from '../types';
import { hasOwnProperty } from '../utils/hasOwnProperty';
import { timestampProperties, timestampPropertyTypes, type Timestamp } from './timestamp-model';

export interface Task extends Timestamp {
  content: ParsedMessageWithAllProps;
}

const taskProperties = ['content'] as const;

type TaskProperties = typeof taskProperties[number];

const propertyTypes: Record<TaskProperties, string> & typeof timestampPropertyTypes = {
  content: 'object',
  ...timestampPropertyTypes,
};

const fileName = 'tasks.json';

const taskValidator = (data: unknown): DataValidatorResponse => {
  let response: DataValidatorResponse = 'valid';

  if (Array.isArray(data)) {
    if (data.length === 0) {
      response = 'valid';
    }

    for (const task of data as unknown[]) {
      if (typeof task !== 'object') {
        response = 'invalid';
      }

      for (const property of [...taskProperties, ...timestampProperties]) {
        if (hasOwnProperty(task, property)) {
          if (typeof task[property] !== propertyTypes[property]) {
            logger.error(`Invalid task format, property ${property} is not of type ${propertyTypes[property]}`);
            response = 'invalid';
          }
        } else {
          logger.error(`Invalid task format, missing property ${property}`);
          response = 'invalid';
        }
      }
    }
  } else {
    response = 'invalid';
  }

  return response;
};

export class TaskModel {
  private static instance: TaskModel;

  private fileManager: FileManager<Task>;
  private tasks: Task[] = [];
  constructor() {
    this.fileManager = new FileManager(fileName, taskValidator);
    this.tasks = this.fileManager.loadData();
  }

  public static getInstance(): TaskModel {
    if (!TaskModel.instance) {
      TaskModel.instance = new TaskModel();
    }
    return TaskModel.instance;
  }

  get data(): Task[] {
    return this.tasks;
  }

  set data(tasks: Task[]) {
    this.tasks = tasks;
  }

  public save(): void {
    if (this.tasks) {
      writeFileSync(fileName, JSON.stringify(this.tasks, null, 2));
    }
  }
}

export const Tasks = TaskModel.getInstance();
