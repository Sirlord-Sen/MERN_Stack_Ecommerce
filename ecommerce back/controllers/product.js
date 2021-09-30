const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require('../models/product');
const {errorHandler} = require("../helpers/dbErrorHandler");


exports.productById = (req, res, next, id) => {
    Product.findById(id)
        .then(product => {
            req.product = product;
            next();
        })
        .catch(err => {
            return res.status(400).json({
                error: "Product not found"
            })
        })
}

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

// Showing all products 
exports.list = (req, res) => {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};


// Read single product
exports.read = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product)
}

/**
 * It will find the products based on the req product category
 * other products that has the same category, will be returned
 */
// Only related products based on category
exports.listRelated = (req, res) => {
   let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({_id: {$ne : req.product }, category: req.product.category})
        .select('-photo')
        .limit(limit)
        .populate('category', '_id name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        })

};

// Displaying Categories based on Products
exports.listCategories = (req, res) => {
    Product.distinct("category", {})
        .then(categories => {
            res.json(categories);
        })
        .catch(err => {
            res.status(400).json({
                error: "Categories not found!!"
            })
        })
};

//listing products by search
exports.listBySearch = (req, res) => {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === 'price') {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select('-photo')
        .populate('category')
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.listSearch = (req, res) => {
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search) {
        // The 'i' used is for case insensitivity.
        query.name = { $regex: req.query.search, $options: 'i' };
        // assign category value to query.category
        if (req.query.category && req.query.category != 'All') {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select('-photo');
    }
};

// Showing photos of products
exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

// Creeting a product
exports.create = (req, res) => {
   let form = new formidable.IncomingForm();
   form.keepExtensions = true;
   form.parse(req, (err, fields, files) => {
       if(err){
           return res.status(400).json({
               error: "Image could not be uploaded"
           });
       }

       // check for all the fields
       const {name, description, price, category, quantity, shipping} = fields; 

       if(!name || !description || !price || !category || !quantity || !shipping){
           return res.status(400).json({
               error: "All fileds are required!"
           })
       }
       let product = new Product(fields);
       if(files.photo){
           if(files.photo.size > 2000000){
               return res.status(400).json({
                   error: "Image should be less than 2mb in size"
               })
           }
           product.photo.data = fs.readFileSync(files.photo.path);
           product.photo.contentType = files.photo.type
       }

       product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }

            res.json(result);
       })
   })
};


// Deleting a product
exports.remove = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: errorHandler(err)
            });
        };

        res.json({
            message: 'Product deleted successfully'
        });
    });
}

// Updating a product
exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if(err){
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        
        let product = req.product;
        product = _.extend(product, fields);

        if(files.photo){
            if(files.photo.size > 2000000){
                return res.status(400).json({
                    error: "Image should be less than 2mb in size"
                })
            }
            product.photo.data = fs.readFileSync(files.photo.path);
            product.photo.contentType = files.photo.type
        }
 
        product.save((err, result) => {
             if (err) {
                 return res.status(400).json({
                     error: errorHandler(err)
                 });
             }
 
             res.json(result);
        })
    })
 };