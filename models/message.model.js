const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const messageSchema = new Schema(
  {
    from: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
