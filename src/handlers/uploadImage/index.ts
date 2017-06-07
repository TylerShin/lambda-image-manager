import S3Manager from "../../helpers/s3Manager";
import FilenameMaker from "../../helpers/filenameMaker";

const handler: AWSLambda.ProxyHandler = async (event, context, _callback) => {

  const buffer = new Buffer(event.body as string, "base64");
  const fileSize = buffer.byteLength;

  // Size validation
  if (fileSize > process.env.MAX_SIZE_LIMIT) {
    return context.done(undefined, {
      statusCode: 403,
      body: JSON.stringify("File size is too big"),
    });
  }

  try {
    const result: any = await S3Manager.uploadFile(
      buffer,
      FilenameMaker.getNewFileId(),
      FilenameMaker.getNewFileName(),
    );

    const keyArray = result.Key.split("/");
    const uploadResult = {
      version: keyArray[keyArray.length - 1],
      fileName: keyArray[keyArray.length - 2],
      id: keyArray[keyArray.length - 3],
    };

    // return HTTP result
    context.done(undefined, {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(uploadResult),
    });
  } catch (err) {
    context.done(err);
  }
};

export default handler;
