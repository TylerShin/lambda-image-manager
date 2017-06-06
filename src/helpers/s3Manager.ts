import * as AWS from "aws-sdk";

class S3Manager {
  private s3 = new AWS.S3();

  public uploadFile(buffer: Buffer, fileId: string, fileName: string, version = "original") {
    return new Promise((resolve, reject) => {
      this.s3.upload({
        Body: buffer,
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${process.env.S3_DEST_PREFIX}/${fileId}/${fileName}/${version}`,
      }, (err: Error, data: any) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  public checkFileExist(fileId: string, fileName: string, version = "original") {
    return new Promise((resolve, _reject) => {
      this.s3.headObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${process.env.S3_DEST_PREFIX}/${fileId}/${fileName}/${version}`,
      }, (err, _metadata) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  public getFile(fileId: string, fileName: string, version = "original") {
    return new Promise((resolve, reject) => {
      this.s3.getObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${process.env.S3_DEST_PREFIX}/${fileId}/${fileName}/${version}`,
      }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Body);
        }
      });
    });
  }
}

const s3Manager = new S3Manager();
export default s3Manager;
