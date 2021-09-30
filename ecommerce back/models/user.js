const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true
        },
        hashedPassword: {
            type: String,
            required: true
        },
        about: {
            type: String,
            trim: true
        },
        salt: String,
        role: {
            type: Number,
            default: 0
        },
        history: {
            type: Array,
            default: []
        },
        cart: {
            items: [
              {
                productId: {
                  type: ObjectId,
                  ref: 'Product',
                  required: true
                },
                quantity: { type: Number, required: true }
              }
            ]
        }
    },
    { timestamps: true }
);

// virtual field
userSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

userSchema.methods = {
    authenticate: function(plainText){
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    encryptPassword: function(password) {
        if (!password) return '';
        try {
            return crypto
                .createHmac('sha1', this.salt)
                .update(password)
                .digest('hex');
        } catch (err) {
            return '';
        }
    }
};


userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });

    console.log(cartProductIndex);
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
  
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
  };
  
  userSchema.methods.updateCart = function(product) {

    const cartProductIndex = this.cart.items.findIndex(cp => {
      return cp.productId.toString() === product.product._id.toString();
    });

    let newQuantity;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = product.quantity;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else{
      console.log("Trying to update while the product isn't in cart")
    }
    const updatedCart = {
      items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();

  };
  
userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
  };
  
  userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
  };
  

module.exports = mongoose.model('User', userSchema);