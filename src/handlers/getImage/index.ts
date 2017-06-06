import * as GraphicMagick from "gm";
import setSize from "./setSize";
import S3Manager from "../../helpers/s3Manager";

const handler: AWSLambda.ProxyHandler = async (event, context, _callback) => {
  const gm = GraphicMagick.subClass({ imageMagick: true });
  let beforeProcessingTime: number;
  let afterProcessingTime: number;
  let buffer: Buffer = new Buffer("");

  let originalImage = gm("./demo/cat.jpg");

  if (event.queryStringParameters) {
    if (event.queryStringParameters["id"] && event.queryStringParameters["fileName"]) {
      const fileId = event.queryStringParameters["id"];
      const fileName = event.queryStringParameters["fileName"];

      const fileExist = await S3Manager.checkFileExist(fileId, fileName);
      if (fileExist) {
        const originFileBuffer = await S3Manager.getFile(fileId, fileName);
        originalImage = (gm as any)(originFileBuffer);
      }
    }
  }

  // Record before image processing time
  beforeProcessingTime = Date.now();

  // Get target image size
  const size = await setSize(event, originalImage);

  // image processing
  await new Promise((resolve, reject) => {
    originalImage
      .resize(size.width, size.height)
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

  // log image processing time
  afterProcessingTime = Date.now();
  if (afterProcessingTime && beforeProcessingTime) {
    console.log(`The image processing time was ${afterProcessingTime - beforeProcessingTime}`);
  }

  // return HTTP result
  await context.done(undefined, {
    statusCode: 200,
    headers: {
      "Content-Type": "image/*",
    },
    body: buffer.toString("base64"),
    isBase64Encoded: true,
  });
};

export default handler;
