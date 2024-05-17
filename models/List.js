const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  customProperties: [
    {
      title: { type: String, required: true },
      fallbackValue: { type: String },
    },
  ],
});

module.exports = mongoose.model("List", listSchema);
