import * as gm from "gm";

export default async function setSize(event: AWSLambda.APIGatewayEvent, gmImage: gm.State) {
  const result = {
    width: 0,
    height: 0,
  };
  // Set resizing options
  if (event.queryStringParameters) {
    if (Number(event.queryStringParameters["width"])) {
      result.width = Number(event.queryStringParameters["width"]);
    }
    if (Number(event.queryStringParameters["height"])) {
      result.height = Number(event.queryStringParameters["height"]);
    }
  } else {
    await new Promise((resolve, reject) => {
      gmImage
        .size((err, size) => {
          if (err) {
            reject(err);
          } else {
            result.width = size.width;
            result.height = size.height;
            resolve();
          }
        });
    });
  }

  return result;
}
