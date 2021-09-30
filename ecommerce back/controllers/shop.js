const Product = require('../models/product');
const {errorHandler} = require("../helpers/dbErrorHandler");

exports.getCart = (req, res, next) => {
    req.profile
      .populate('cart.items.productId')
      .execPopulate()
      .then(user => {
        const products = user.cart.items;
        return res.json(products);
      })
      .catch(err => {
        res.status(400).json({
            error: errorHandler(err)
        })
      });
  };
  

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
      .then(product => {
        return req.profile.addToCart(product);
      })
      .catch(err => {
        res.status(400).json({
            error: "Adding cart failed"
        })
      });
  };
  
  exports.updateCart = (req, res, next) => {
    const prodId = req.body.productId.productId;
    const quantity = req.body.quantity;
    Product.findById(prodId)
      .then(product => {
        return req.profile.updateCart({product, quantity});
      })
      .catch(err => {
        res.status(400).json({
            error: "Updating cart failed"
        })
      });
  };
  
  
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.profile
        .removeFromCart(prodId)
        .then(result => {
        })
        .catch(err => {
            res.status(400).json({
                error: "I couldn't delete the this thing"
            })
        });
  };
  