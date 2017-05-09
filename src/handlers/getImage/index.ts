import * as GraphicMagick from "gm";
import setSize from "./setSize";

const handler: AWSLambda.ProxyHandler = async (event, context, _callback) => {
  const gm = GraphicMagick.subClass({ imageMagick: true });
  let beforeProcessingTime: number;
  let afterProcessingTime: number;
  let buffer: Buffer = new Buffer("sample buffer");

  // Record before image processing time
  beforeProcessingTime = Date.now();

  // set gmState from image
  const originalImage = gm("./demo/cat.jpg");

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
