const express = require("express");
const router = express.Router();

const {requireSignin, isAdmin, isAuth} = require("../controllers/auth");
const {userById} = require("../controllers/user");

const {
    list, 
    listSearch,
    listRelated,
    listCategories,
    listBySearch, 
    photo,
    create, 
    productById, 
    read, 
    remove, 
    update
} = require("../controllers/product");


router.get('/products', list);
router.get("/products/search", listSearch);
router.get('/products/related/:productId', listRelated);
router.get('/products/categories', listCategories);
router.post("/products/by/search", listBySearch);
router.get('/product/photo/:productId', photo)
router.get('/product/:productId', read)

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/product/:productId/:userId',requireSignin, isAuth, isAdmin, update);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);


router.param('userId', userById);
router.param('productId', productById);

module.exports = router;