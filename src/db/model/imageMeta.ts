const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const imageMetaSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  version: {
    type: String,
    rangeKey: true,
  },
  url: {
    type: String,
  },
  downloadCount: {
    type: Number,
  },
});

const ImageMeta = dynamoose.model("lambda-image-manager-stats", imageMetaSchema);

export default ImageMeta;
