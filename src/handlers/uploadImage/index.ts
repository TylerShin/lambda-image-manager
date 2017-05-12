import * as Busboy from "busboy";

const handler: AWSLambda.ProxyHandler = async (event, context, _callback) => {
  // const gm = GraphicMagick.subClass({ imageMagick: true });
  const buffer = new Buffer(event.body || "", "base64");
  console.log(buffer.toString())  ;

  const contentType = event.headers["Content-Type"] || event.headers["content-type"];
  console.log(contentType);
  const busboy = new Busboy({ headers: { "content-type": contentType }});

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(
      "File [" + fieldname + "]: filename: " + filename + ", encoding: " + encoding + ", mimetype: " + mimetype,
    );
    file.on("data", (data: any) => {
      console.log("File [" + fieldname + "] got " + data.length + " bytes");
    });
    file.on("end", () => {
      console.log("File [" + fieldname + "] Finished");
    });
  });
  busboy.on("field", (fieldname, val) => {
    console.log("Field [" + fieldname + "]: value: " + (val));
  });
  busboy.on("finish", () => {
    console.log("Done parsing form!");

    // return HTTP result
    context.done(undefined, {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify("hello world"),
    });
  });
  busboy.on("error", (err: Error) => {
    console.log("failed", err);
  });

  console.log(event.body);

  busboy.end(buffer.toString());
};

export default handler;
