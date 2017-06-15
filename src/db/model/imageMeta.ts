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
  throughput: {
    read: 1,
    write: 1,
  },
  timestamps: true,
});

const ImageMeta = dynamoose.model("lambda-image-manager-stats", imageMetaSchema);

export default ImageMeta;
