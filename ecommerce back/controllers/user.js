const User = require('../models/user');
const errorHandler = require('../helpers/dbErrorHandler');

exports.userById = (req, res, next, id) => {
    User.findById(id)
        .then(user => {
            req.profile = user;
            next();
        })
        .catch(err => {
            return res.status(400).json({
                error: "User not found"
            })
        })
};

exports.read = (req, res) => {
    req.profile.hashedPassword = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.update = (req, res, next) => {
    User.findOneAndUpdate(
        { _id: req.profile._id },
        { $set: req.body },
        { new: true }
    )
    .then(user => {
        user.hashedPassword = undefined;
        user.salt = undefined;
        res.json(user);
    })
    .catch(err => {
        res.status(400).json({
            error: "You are not authorized to perform this action"
        })
    })
}

exports.purchaseHistory = (req, res, next) => {
    
}