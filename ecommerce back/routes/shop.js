const express = require('express');
const router = express.Router();

const {getCart, postCart, updateCart, postCartDeleteProduct} = require('../controllers/shop');
const {requireSignin, isAuth} = require("../controllers/auth");
const {userById} = require("../controllers/user");


router.get('/cart/:userId', requireSignin ,isAuth, getCart);

router.post('/cart/:userId', requireSignin, isAuth ,postCart);

router.put('/cart/:userId', requireSignin, isAuth ,updateCart);

router.delete('/cart-delete-item/:userId', requireSignin ,isAuth, postCartDeleteProduct);

// router.get('/checkout', isAuth, shopController.getCheckout);

// router.post('/create-order', isAuth, shopController.postOrder);

// router.get('/orders', isAuth, shopController.getOrders);

// router.get('/orders/:orderId', isAuth, shopController.getInvoice);

router.param('userId', userById);

module.exports = router;
