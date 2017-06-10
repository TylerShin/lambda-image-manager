import * as GraphicMagick from "gm";
import * as uuid from "uuid";
import setSize from "./setSize";
import S3Manager from "../../helpers/s3Manager";
import ImageMeta from "../../db/model/imageMeta";
// interfaces
import FileNameMaker, { IImageProcessOptions } from "../../helpers/filenameMaker";

const handler: AWSLambda.ProxyHandler = async (event, context, _callback) => {
  const gm = GraphicMagick.subClass({ imageMagick: true });
  const imageProcessOptions: IImageProcessOptions = {
    width: 0,
    height: 0,
  };

  let buffer: Buffer = new Buffer("");

  let originalImage = gm("./demo/cat.jpg");

  if (event.queryStringParameters) {
    // Get target image size
    const size = await setSize(event, originalImage);
    imageProcessOptions.width = size.width;
    imageProcessOptions.height = size.height;

    if (event.queryStringParameters["id"] && event.queryStringParameters["filename"]) {
      const fileId = event.queryStringParameters["id"];
      const fileName = event.queryStringParameters["filename"];

      let version = FileNameMaker.getVersion(imageProcessOptions);
      if (imageProcessOptions.width === 0 || imageProcessOptions.height === 0) {
        version = "original";
      }

      const fileExist = await S3Manager.checkFileExist(fileId, fileName, version);

      if (fileExist) {
        const originFileBuffer = await S3Manager.getFile(fileId, fileName, version);
        originalImage = (gm as any)(originFileBuffer);

        await new Promise((resolve, reject) => {
          originalImage
            .setFormat("jpeg")
            .toBuffer((err, resultBuffer) => {
              if (err) {
                console.error(`Had error to make buffer from image`, err);
                reject(err);
              } else {
                buffer = resultBuffer;
                resolve();
              }
            });
        });
      } else {
        const originFileBuffer = await S3Manager.getFile(fileId, fileName);
        originalImage = (gm as any)(originFileBuffer);

        // image processing
        await new Promise((resolve, reject) => {
          originalImage
            .resize(imageProcessOptions.width, imageProcessOptions.height)
            .setFormat("jpeg")
            .toBuffer((err, resultBuffer) => {
              if (err) {
                reject(err);
              } else {
                buffer = resultBuffer;
                resolve();
              }
            });
        });

        await S3Manager.uploadFile(buffer, fileId, fileName, version);
      }

      // Record download count to DynamoDB
      await new Promise((resolve, reject) => {
        const newImageMeta = new ImageMeta({
          fileId,
          version,
          id: uuid.v4(),
          fileName,
        });

        newImageMeta.save((error: Error) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Succeeded to record result to DynamoDB");
            resolve();
          }
        });
      });
    }
  }

  // return HTTP result
  context.done(undefined, {
    statusCode: 200,
    headers: {
      "Content-Type": "image/*",
    },
    body: buffer.toString("base64"),
    isBase64Encoded: true,
  });
};

export default handler;
