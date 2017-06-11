const dynamoose = require("dynamoose");

const Schema = dynamoose.Schema;

const imageMetaSchema = new Schema({
  fileId: {
    type: String,
    hashKey: true,
  },
  id: {
    type: String,
    rangeKey: true,
  },
  version: {
    type: String,
  },
  fileName: {
    type: String,
  },
}, {
  timestamps: true,
});

const ImageMeta = dynamoose.model("lambda-image-manager-stats", imageMetaSchema);

export default ImageMeta;
