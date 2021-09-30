const Category = require('../models/category');
const Product  = require('../models/product');
const {errorHandler} = require("../helpers/dbErrorHandler");

exports.categoryById = (req, res, next, id) => {
    Category.findById(id)
        .then(category => {
            req.category = category;
            next();
        })
        .catch(err => {
            return res.status(400).json({
                error: "Category not found"
            })
        })
}

exports.read = (req, res) => {
    return res.json(req.category);
};

exports.create = (req, res) => {
    const category = new Category(req.body);
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
};

exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.remove = (req, res) => {
    const category = req.category;
    Product.find({ category })
        .then(data => {
            if (data.length >= 1) {
                return res.status(400).json({
                    message: `Sorry. You cant delete ${category.name}. It has ${data.length} associated products.`
                });
            } else {
                category.remove((err, data) => {
                    if (err) {
                        return res.status(400).json({
                            error: errorHandler(err)
                        });
                    }
                    res.json({
                        message: 'Category deleted'
                    });
                });
            }
        })
        .catch(err => {
            res.json({
                error: errorHandler(err)
            })
        })
};

exports.list = (req, res) => {
    Category.find()
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            return res.status(400).json({
                error: errorHandler(err)
            });
        });
};