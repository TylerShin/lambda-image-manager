// import * as Busboy from "busboy";
// import * as AWS from "aws-sdk";
import S3Manager from "../../helpers/s3Manager";

const handler: AWSLambda.ProxyHandler = async (event, context, _callback) => {

  console.log(event.body, "event. body");
  const buffer = new Buffer(event.body as string, "base64");
  const decodedString = buffer.toString("ascii");
  console.log(decodedString, "decoded body");

  try {
    await S3Manager.uploadFile(buffer, "hosigi", "chicken");
    // return HTTP result
    context.done(undefined, {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(decodedString),
    });
  } catch (_err) {
    // return HTTP result
    context.done(undefined, {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(decodedString),
    });
  }
};

export default handler;
