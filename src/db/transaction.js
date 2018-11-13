const mongoose = require("mongoose");

const { Schema } = mongoose;

const transactionSchema = new Schema({
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
  createdDate: { type: Date, default: Date.now }
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
