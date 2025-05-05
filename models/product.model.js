const mongoose = require('mongoose');
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  price: { type: Number, required: true },
  rating: { type: Number },
  image: { type: String },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
