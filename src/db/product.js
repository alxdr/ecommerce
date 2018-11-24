const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    department: { type: String, required: true },
    text: String,
    price: { type: String, required: true },
    imageSrc: { type: String, required: true },
    seller: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    votes: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" } }
);

productSchema.plugin(mongooseDelete, { overrideMethods: "all" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
