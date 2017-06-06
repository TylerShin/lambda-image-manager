import * as uuid from "uuid";

export interface IImageProcessOptions {
  width: number;
  height: number;
}

export default class FileNameMaker {
  public static getNewFileId() {
    const date = new Date();
    return date.toISOString();
  }

  public static getNewFileName() {
    return uuid.v4();
  }

  public static getVersion(processOptions: IImageProcessOptions) {
    return JSON.stringify(processOptions);
  }
}
