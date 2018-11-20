const mongoose = require("mongoose");

const { Schema } = mongoose;

const reviewSchema = new Schema({
  target: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true, ref: "User" }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
