import * as fs from "fs";
import * as GraphicMagick from "gm";

const handler: AWSLambda.ProxyHandler = async (event, context, _callback) => {
  const gm = GraphicMagick.subClass({ imageMagick: true });

  const buffer = Buffer.from(event.body || "", "base64");

  fs.writeFileSync("/tmp/original.png", buffer, "base64");
  fs.readFile("/tmp/original.png", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
      console.log(data.toString("base64"));
    }
  });

  if (event.body) {
    await new Promise((resolve, reject) => {
      gm("/tmp/original.png")
        .write("/tmp/result", (err: Error, res: any) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(res);
            resolve();
          }
        });
    });
  }

  // return HTTP result
  context.done(undefined, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials" : true,
    },
    body: JSON.stringify("hello world"),
    isBase64Encoded: true,
  });
};

export default handler;
