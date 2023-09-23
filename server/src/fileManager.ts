import { existsSync, readFileSync, writeFileSync } from 'fs';
import pc from 'picocolors';
import { logger } from './logger';
import { isError } from './utils/isError';

export type DataValidatorResponse = 'valid' | 'invalid' | 'missingData';
type DataValidator = (data: unknown) => DataValidatorResponse;

export class FileManager<T> {
  private data?: T[];

  constructor(
    private fileName: string,
    private validator: DataValidator,
    private propertyDefaultValues?: Record<string, unknown>,
  ) {
    this.fileName = fileName;
    this.validator = validator;
    if (!existsSync(this.fileName)) {
      logger.info(`${this.fileName} does not exist, creating...`);
      writeFileSync(this.fileName, '');
    }
  }

  public loadData(): T[] {
    const fileContent = readFileSync(this.fileName, 'utf8');
    let parsedFileContent: unknown;
    try {
      parsedFileContent = JSON.parse(fileContent);
    } catch (error) {
      if (isError(error)) {
        if (error.message.includes('Unexpected end of JSON input')) {
          logger.info(`${pc.magenta('Error handled gracefully:')} Empty JSON in file ${this.fileName}. Setting data to empty array.`);
          this.data = [] as T[];
          return this.data;
        }
      }
      throw new Error(`Invalid JSON in file ${this.fileName}`);
    }
    const validatorResponse = this.validator(parsedFileContent);
    if (validatorResponse === 'valid') {
      this.data = parsedFileContent as T[];
      return this.data;
    } else if (validatorResponse === 'missingData') {
      // Add default values to missing properties
      this.data = (parsedFileContent as T[]).map((data) => {
        const newData = { ...this.propertyDefaultValues, ...data };
        return newData as T;
      });
      // Save data with default values
      this.saveData(this.data);
      return this.data;
    } else {
      throw new Error(`Invalid data format in file ${this.fileName}`);
    }
  }

  public saveData(data: T[]): void {
    writeFileSync(this.fileName, JSON.stringify(data, null, 2));
    this.data = data;
  }
}
