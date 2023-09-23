import type { DataValidatorResponse } from '../fileManager';
import { FileManager } from '../fileManager';
import { logger } from '../logger';
import { hasOwnProperty } from '../utils/hasOwnProperty';
import type { Timestamp } from './timestamp-model';
import { timestampProperties, timestampPropertyTypes } from './timestamp-model';

export interface User extends Timestamp {
  userId: string;
  nick: string;
  displayName: string;
  welcomeMessage: string;
  points: number;
  experience: number;
  lastSeen: string;
  avatarUrl: string;
  numberOfMessages: number;
}

const userProperties = [
  'userId',
  'nick',
  'displayName',
  'welcomeMessage',
  'points',
  'experience',
  'lastSeen',
  'avatarUrl',
  'numberOfMessages',
] as const;

type UserProperties = (typeof userProperties)[number];

const requiredProperties = ['userId', 'nick', 'displayName'] as const;

const propertyTypes: Record<UserProperties, string> & typeof timestampPropertyTypes = {
  userId: 'string',
  nick: 'string',
  displayName: 'string',
  welcomeMessage: 'string',
  points: 'number',
  experience: 'number',
  lastSeen: 'string',
  avatarUrl: 'string',
  numberOfMessages: 'number',
  ...timestampPropertyTypes,
};

const propertyDefaultValues: Record<UserProperties, string | number> = {
  userId: '',
  nick: '',
  displayName: '',
  welcomeMessage: '',
  points: 0,
  experience: 0,
  lastSeen: '0',
  avatarUrl: '',
  numberOfMessages: 0,
};

const fileName = 'users.json';

const userValidator = (data: unknown): DataValidatorResponse => {
  let response: DataValidatorResponse = 'valid';

  if (Array.isArray(data)) {
    if (data.length === 0) {
      response = 'valid';
    }

    for (const user of data as unknown[]) {
      if (typeof user !== 'object') {
        response = 'invalid';
      }

      if (!user) {
        response = 'invalid';
      }

      for (const requiredProperty of requiredProperties) {
        if (!hasOwnProperty(user, requiredProperty)) {
          logger.error(`Invalid user format, missing property ${requiredProperty}`);
          response = 'invalid';
        }
      }

      for (const property of [...userProperties, ...timestampProperties]) {
        if (hasOwnProperty(user, property)) {
          if (typeof user[property] !== propertyTypes[property]) {
            logger.error(`Invalid user format, property ${property} is not of type ${propertyTypes[property]}`);
            response = 'invalid';
          }
        } else {
          logger.warn(`Invalid user format, missing property ${property}. Default value will be set.`);
          response = 'missingData';
        }
      }
    }
  } else {
    response = 'invalid';
  }

  return response;
};

export class UserModel {
  private static instance: UserModel;

  private fileManager: FileManager<User>;
  private users: User[] = [];
  constructor() {
    this.fileManager = new FileManager(fileName, userValidator, propertyDefaultValues);
    this.users = this.fileManager.loadData();
  }

  public static getInstance(): UserModel {
    if (!UserModel.instance) {
      UserModel.instance = new UserModel();
    }
    return UserModel.instance;
  }

  get data(): User[] {
    // Return a copy of the data
    return [...this.users];
  }

  public findOneByUserId(userId: string): User | null {
    const user = this.users.find((user) => user.userId === userId);
    if (!user) {
      return null;
    }
    return user;
  }

  public findOneByDisplayName(displayName: string): User | null {
    const user = this.users.find((user) => user.displayName === displayName);
    if (!user) {
      return null;
    }
    return user;
  }

  public findOneByNick(nick: string): User | null {
    const user = this.users.find((user) => user.nick === nick);
    if (!user) {
      return null;
    }
    return user;
  }

  public saveOne(user: User): void {
    if (this.users) {
      const index = this.users.findIndex((u) => u.userId === user.userId);
      if (index === -1) {
        this.users.push(user);
      } else {
        this.users[index] = user;
      }
      this.fileManager.saveData(this.users);
    }
  }

  public deleteOne(user: User): void {
    if (this.users) {
      const index = this.users.findIndex((u) => u.userId === user.userId);
      if (index !== -1) {
        this.users.splice(index, 1);
        this.fileManager.saveData(this.users);
      } else {
        logger.error(`Problem deleting user: ${user.userId} not found`);
      }
    }
  }
}

export const Users = UserModel.getInstance();
