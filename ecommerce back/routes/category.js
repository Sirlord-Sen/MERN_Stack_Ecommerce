const express = require("express");
const router = express.Router();

const {categoryById ,create , read, update, remove, list} = require("../controllers/category");
const {requireSignin, isAdmin, isAuth} = require("../controllers/auth");
const {userById} = require("../controllers/user");

router.get('/category/:categoryById', read);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/category/:categoryById/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/category/:categoryById/:userId',  requireSignin, isAuth, isAdmin, remove);
router.get('/categories', list);

router.param('userId', userById);
router.param('categoryById', categoryById);

module.exports = router;