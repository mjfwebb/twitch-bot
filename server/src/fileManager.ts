import { existsSync, readFileSync, writeFileSync } from 'fs';

type DataValidator<T> = (data: unknown) => data is T;

export class FileManager<T> {
  private fileName: string;
  private data?: T;
  private validator: DataValidator<T>;

  constructor(fileName: string, validator: DataValidator<T>) {
    this.fileName = fileName;
    this.validator = validator;
    if (!existsSync(this.fileName)) {
      console.log(`${this.fileName} does not exist, creating...`);
      writeFileSync(this.fileName, '');
    }
  }

  public loadData(): T {
    const fileContent = readFileSync(this.fileName, 'utf8');
    let parsedFileContent: unknown;
    try {
      parsedFileContent = JSON.parse(fileContent);
    } catch (error) {
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
