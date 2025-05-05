const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/:productId', verifyToken, favoriteController.toggleFavorite);
router.get('/', verifyToken, favoriteController.getFavorites);

module.exports = router;
