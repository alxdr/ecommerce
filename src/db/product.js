const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    department: { type: String, required: true },
    text: String,
    price: { type: String, required: true },
    imageSrc: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, required: true, ref: "User" }
  },
  { timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" } }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
