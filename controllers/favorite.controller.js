const Favorite = require('../models/favorite.model');
const Product = require('../models/product.model');

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const existing = await Favorite.findOne({ user: userId, product: productId });

    if (existing) {
      await existing.deleteOne();
      return res.json({ msg: 'Removed from favorites' });
    } else {
      const product = await Product.findOne({ _id: productId, isDeleted: false });
      if (!product) return res.status(404).json({ msg: 'Product not found or deleted' });

      await Favorite.create({ user: userId, product: productId });
      return res.status(201).json({ msg: 'Added to favorites' });
    }
  } catch (err) {
    res.status(500).json({ msg: 'Error toggling favorite', error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ user: userId })
      .populate('product');

    const activeFavorites = favorites
      .filter(fav => !fav.product.isDeleted)
      .map(fav => fav.product);

    res.json(activeFavorites);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching favorites', error: err.message });
  }
};