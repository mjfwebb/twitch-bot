import { existsSync, readFileSync, writeFileSync } from 'fs';
import pc from 'picocolors';
import { logger } from './logger';
import { isError } from './utils/isError';

type DataValidator<T> = (data: unknown) => data is T;

export class FileManager<T> {
  private fileName: string;
  private data?: T;
  private validator: DataValidator<T>;

  constructor(fileName: string, validator: DataValidator<T>) {
    this.fileName = fileName;
    this.validator = validator;
    if (!existsSync(this.fileName)) {
      logger.info(`${this.fileName} does not exist, creating...`);
      writeFileSync(this.fileName, '');
    }
  }

  public loadData(): T {
    const fileContent = readFileSync(this.fileName, 'utf8');
    let parsedFileContent: unknown;
    try {
      parsedFileContent = JSON.parse(fileContent);
    } catch (error) {
      if (isError(error)) {
        if (error.message.includes('Unexpected end of JSON input')) {
          logger.info(`${pc.magenta('Error handled gracefully:')} Empty JSON in file ${this.fileName}. Setting data to empty array.`);
          this.data = [] as T;
          return this.data;
        }
      }
      throw new Error(`Invalid JSON in file ${this.fileName}`);
    }
    if (this.validator(parsedFileContent)) {
      this.data = parsedFileContent;
      return this.data;
    } else {
      throw new Error(`Invalid data format in file ${this.fileName}`);
    }
  }

  public saveData(data: T): void {
    writeFileSync(this.fileName, JSON.stringify(data, null, 2));
  }
}
