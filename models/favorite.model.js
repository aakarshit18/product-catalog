const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, {
  timestamps: true
});

favoriteSchema.index({ user: 1, product: 1 }, { unique: true }); // to avoid duplicates

module.exports = mongoose.model('Favorite', favoriteSchema);
