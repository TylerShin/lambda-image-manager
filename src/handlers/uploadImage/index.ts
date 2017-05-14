import * as Busboy from "busboy";
import * as AWS from "aws-sdk";

const handler: AWSLambda.ProxyHandler = async (event, context, _callback) => {
  const buffer = new Buffer(event.body || "", "base64");
  const contentType = event.headers["Content-Type"] || event.headers["content-type"];
  const busboy = new Busboy({ headers: { "content-type": contentType }});

  const s3 = new AWS.S3();

  const promiseArr: Array<Promise<any>> = [];
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(
      "File [" + fieldname + "]: filename: " + filename + ", encoding: " + encoding + ", mimetype: " + mimetype,
    );

    file.on("data", (data: any) => {
      console.log("File [" + fieldname + "] got " + data.length + " bytes");

      const date = new Date();
      const fileId = date.toISOString();


      // console.log("UTF8", data.toString("utf8"));
      // console.log("ASCII", data.toString("ascii"));
      // console.log("BASE64", data.toString("base64"));

      promiseArr.push(new Promise((resolve, reject) => {
        s3.upload({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${process.env.S3_DEST_PREFIX}/${fileId}/${filename}`,
          ContentType: mimetype,
          Body: data,
        }, undefined, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(`S3 upload success! result === ${JSON.stringify(result)}`);
            resolve();
          }
        });
      }));
    });

    file.on("end", () => {
      console.log("File [" + fieldname + "] Finished");
    });

  });
  busboy.on("field", (fieldname, val) => {
    console.log("Field [" + fieldname + "]: value: " + (val));
  });

  busboy.on("finish", async () => {
    console.log("Done parsing form!");

    await Promise.all(promiseArr);
    // return HTTP result
    context.done(undefined, {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify(process.env),
    });
  });

  busboy.on("error", (err: Error) => {
    console.log("failed", err);
  });


  console.log(buffer.toString());

  busboy.end(buffer.toString());
};

export default handler;
