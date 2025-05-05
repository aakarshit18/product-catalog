const Product = require('../models/product.model');
const Review = require('../models/review.model');
const User = require('../models/user.model')

exports.createProduct = async (req, res) => {
    try {
        const { name, description, category, price } = req.body;
        // Construct the absolute URL dynamically based on the request's protocol and host
        const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}` : undefined;
        const product = await Product.create({ name, description, category, price, image });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Error creating product', error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, category, price } = req.body;
        const image = req.file ? `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}` : undefined; // Dynamically get the absolute path

        const update = {};

        if (name !== undefined) update.name = name;
        if (description !== undefined) update.description = description;
        if (category !== undefined) update.category = category;
        if (price !== undefined) update.price = price;
        if (image !== undefined) update.image = image;

        const product = await Product.findByIdAndUpdate(id, update, { new: true });

        if (!product) return res.status(404).json({ msg: 'Product not found' });

        res.json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Error updating product', error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        res.json({ msg: 'Product soft-deleted' });
    } catch (err) {
        res.status(500).json({ msg: 'Error deleting product', error: err.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const { category, minPrice, maxPrice, rating, search, sortBy, order = 'asc', page = 1, limit = 10 } = req.query;
        const filter = { isDeleted: false };

        if (category) filter.category = category;
        if (rating) filter.rating = { $gte: rating };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = minPrice;
            if (maxPrice) filter.price.$lte = maxPrice;
        }

        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const sortOptions = {};
        if (sortBy) {
            sortOptions[sortBy] = order === 'desc' ? -1 : 1;
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(filter)
            .sort(sortOptions)
            .skip(skip)
            .limit(Number(limit));

        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: 'Error fetching products', error: err.message });
    }
};

// Create a review for a product
exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.id;
        const userId = req.user.id;

        // Prevent duplicate review
        const existingReview = await Review.findOne({ user: userId, product: productId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product.' });
        }

        // Create new review
        const review = await Review.create({
            user: userId,
            product: productId,
            rating,
            comment
        });

        // Recalculate average rating
        const reviews = await Review.find({ product: productId });
        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

        // Update product average rating
        await Product.findByIdAndUpdate(productId, { rating: avgRating });

        res.status(201).json({ message: 'Review added successfully', review });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const mongoose = require('mongoose');

exports.getProductWithReviews = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId).lean();
      if (!product || product.isDeleted) return res.status(404).json({ message: 'Product not found' });
  
      // Get reviews
      const reviews = await Review.find({ product: productId }).populate('user', 'name email');
  
      res.json({ product, reviews });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
};

  
  



