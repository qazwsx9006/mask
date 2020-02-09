const _ = require("lodash");
const mongoose = require("mongoose");

const getModels = function() {
  const definition = {
    _id: { type: String, require: true },
    name: { type: String, required: true },
    openTime: { type: String },
    address: { type: String },
    note: { type: String },
    maskAdult: { type: Number, default: 0 },
    maskChild: { type: Number, default: 0 },
    condition: { type: Object },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point"
      },
      coordinates: {
        // [<longitude>, <latitude> ]
        type: [Number],
        index: { type: "2dsphere", sparse: true },
        validate: function([lng, lat]) {
          if (
            !_.some(this.topics, topicId =>
              _.includes(config.topics.distance, topicId)
            )
          )
            return true;
          if (!lat || !lng) throw new Error(`lng and lat is required.`);
          return true;
        }
      }
    },
    createdAt: { type: Date, default: Date.now, required: true },
    updatedAt: { type: Date, default: Date.now }
  };
  let schema = new mongoose.Schema(definition);

  return mongoose.model("Store", schema);
};

module.exports = getModels;
