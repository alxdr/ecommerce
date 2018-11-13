const mongoose = require("mongoose");

const { Schema } = mongoose;

const testSchema = new Schema(
  {
    selling: [{ type: Schema.Types.ObjectId, ref: "Product" }]
  },
  { timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" } }
);

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
