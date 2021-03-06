const mongoose = require("mongoose");

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    target: { type: Schema.Types.ObjectId, required: true }, // either targets message or product
    text: { type: String, required: true },
    replies: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    votes: { type: Number, default: 0 }
  },
  { timestamps: { createdAt: "createdDate", updatedAt: "updatedDate" } }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
