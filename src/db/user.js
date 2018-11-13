const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    stripe: {
      connected: { type: Boolean, default: false },
      stripeKey: { type: String, default: null },
      stripeSecret: { type: String, default: null },
      stripeUID: { type: String, default: null },
      refreshTok: { type: String, default: null },
      accessTok: { type: String, default: null }
    },
    selling: [{ type: Schema.Types.ObjectId, ref: "Product" }]
  },
  { timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" } }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
