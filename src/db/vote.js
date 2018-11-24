const mongoose = require("mongoose");

const { Schema } = mongoose;

const voteSchema = new Schema(
  {
    target: { type: Schema.Types.ObjectId, required: true }, // targets messages or reviews or products
    type: {
      type: String,
      enum: ["Message", "Review", "Product"],
      required: true
    },
    vote: { type: Boolean, required: true }, // true for up, false for down
    by: { type: Schema.Types.ObjectId, required: true, ref: "User" }
  },
  { timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" } }
);

const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;
