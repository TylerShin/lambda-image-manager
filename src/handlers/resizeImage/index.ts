import Jimp = require("jimp");

const handler: AWSLambda.ProxyHandler = async (event, context, _callback) => {
  let beforeProcessingTime: number;
  let afterProcessingTime: number;
  let image: any;
  let buffer: Buffer = new Buffer("sample buffer");

  beforeProcessingTime = Date.now();
  if (event.queryStringParameters) {
    const targetWidth = Number(event.queryStringParameters["width"]);
    const targetHeight = Number(event.queryStringParameters["height"]);
    try {
      image = await Jimp.read("./demo/cat.jpg");
      image = await image.resize(targetWidth, targetHeight, Jimp.RESIZE_BEZIER);
      buffer = await new Promise<Buffer>((resolve, reject) => {
      image.getBuffer(Jimp.AUTO, (err: Error, buffer: any) => {
        if (err) {
          console.error(err);
          reject(err);
          return context.done(new Error("no queryStringParameters"));
        } else {
          resolve(buffer);
        }
      });
    });
   } catch (err) {
      console.error(err);
    }
  } else {
    return await context.done(new Error("no queryStringParameters"));
  }

  afterProcessingTime = Date.now();
  if (afterProcessingTime && beforeProcessingTime) {
    console.log("image processing time ===", afterProcessingTime - beforeProcessingTime);
    console.log(buffer);
  }

  await context.done(undefined, {
    statusCode: 200,
    headers: {
      'Content-Type': "image/*",
    },
    body: buffer.toString("base64"),
    isBase64Encoded: true,
  });
};

export default handler;
