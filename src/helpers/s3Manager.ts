import * as AWS from "aws-sdk";

class S3Manager {
  private s3 = new AWS.S3();

  public checkFileExist(fileId: string, fileName: string) {
    return new Promise((resolve, _reject) => {
      this.s3.headObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${process.env.S3_DEST_PREFIX}/${fileId}/${fileName}`,
      }, (err, _metadata) => {
        if (err && err.code === "NotFound") {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  public getOriginFile(fileId: string, fileName: string) {
    return new Promise((resolve, reject) => {
      this.s3.getObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${process.env.S3_DEST_PREFIX}/${fileId}/${fileName}`,
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
