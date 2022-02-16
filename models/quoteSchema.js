const mongoose = require("mongoose");
const { Schema } = mongoose;

const quoteSchema = new Schema({
  author: { type: String, required: true },
  quote: { type: String, required: true },
  keywords: { type: String, required: true },
  image: {
    type: String,
    default: function () {
      return `https://source.unsplash.com/1600x900/?${this.keywords}`;
    },
  },
});

const QuoteCollection = mongoose.model("quote", quoteSchema);
module.exports = QuoteCollection;
