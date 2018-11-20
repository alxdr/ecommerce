const mongoose = require("mongoose");

const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    seller: {
      id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      email: { type: String, required: true }
    },
    buyer: {
      id: { type: Schema.Types.ObjectId, required: true, ref: "User" },
      email: { type: String, required: true }
    },
    product: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
    amount: { type: String, required: true },
    shipping: { type: Map, of: String, required: true },
    review: { type: Schema.Types.ObjectId, default: null, ref: "Review" }
  },
  { timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" } }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
