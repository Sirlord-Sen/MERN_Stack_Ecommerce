import React, {useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import ShowImage from './ShowImage';
import moment from 'moment';
import {addProductCart, updateCart, removeCartProduct} from './apiCore';
import {isAuthenticated} from '../auth/index';

const Card = ({
  product,
  quantity,
  showViewProductButton = true,
  showAddToCartButton = true,
  cartUpdate = false,
  showRemoveProductButton = false,
  setRun = f => f,
  run = undefined
  // changeCartSize
}) => {
  const [redirect, setRedirect] = useState(false);
  const [count, setCount] = useState(quantity);
  const [ updatedQuantity, setUpdatedQuantity] = useState();

  // destructure user and token from localstorage
  const { user, token } = isAuthenticated();

  const showViewButton = showViewProductButton => {
    return (
      showViewProductButton && (
        <Link to={`/product/${product._id}`} className="mr-2">
          <button className="btn btn-outline-primary mt-2 mb-2 card-btn-1">View Product</button>
        </Link>
      )
    );
  };

  const addToCart = async() => {
    try{
      setRedirect(true);
      const addingToCart = await addProductCart(user._id, token, {productId: product._id})      
    }
    catch(err){
      console.log(err);
    }
  };

  const shouldRedirect = redirect => {
    if (redirect) {
      return <Redirect to={`/cart/${user._id}`}/>;
    }
  };

  const showAddToCartBtn = showAddToCartButton => {
    return (
      showAddToCartButton && (
        <button onClick={addToCart} className="btn btn-outline-warning mt-2 mb-2 card-btn-1  ">
          Add to cart
        </button>
      )
    );
  };

  const showStock = quantity => {
    return quantity > 0 ? (
      <span className="badge badge-primary badge-pill">In Stock </span>
    ) : (
      <span className="badge badge-primary badge-pill">Out of Stock </span>
    );
  };

  const handleChange = productId => event => {
    setRun(!run); // run useEffect in parent Cart
    setCount(event.target.value < 1 ? 1 : event.target.value);
    if (event.target.value >= 1) {
      setUpdatedQuantity(event.target.value);
    }
  };

  const clickUpdate = () => {
    if(updatedQuantity){
      updateCart(user._id, token, {productId: product._id}, updatedQuantity);
      setRedirect(true);
    } 
  }

  const showCartUpdateOptions = cartUpdate => {
    return (
      cartUpdate && (
        <div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">Adjust Quantity</span>
            </div>
            <input type="number" className="form-control" value={count} onChange={handleChange(product._id)} />
          </div>
          <button onClick={clickUpdate}>
              Update Product
          </button>
        </div>
      )
    );
  };

  const showRemoveButton = showRemoveProductButton => {
    return (
      showRemoveProductButton && (
        <button
          onClick={() => {
            removeCartProduct(user._id, token, {productId: product._id})
              .then(result=> {
                console.log(result);
              });
            setRun(!run); // run useEffect in parent Cart
          }}
          className="btn btn-outline-danger mt-2 mb-2"
        >
          Remove Product
        </button>
        
      )
    );
  };

  return (
    <div className="card ">
      <div className="card-header card-header-1 ">{product.name}</div>
      <div className="card-body">
        {shouldRedirect(redirect)}
        <ShowImage item={product} url="product" />
        <p className="card-p  mt-2">{product.description.substring(0, 100)} </p>
        <p className="card-p black-10">$ {product.price}</p>

        {/* Remember Lord. You havent fixed the category name for the cart section */}
        <p className="black-9">Category: {product.category && product.category.name}</p>

        <p className="black-8">Added on {moment(product.createdAt).fromNow()}</p>
        {showStock(product.quantity)}
        <br />

        {showViewButton(showViewProductButton)}

        {showAddToCartBtn(showAddToCartButton)}

        {showRemoveButton(showRemoveProductButton)} 

        {showCartUpdateOptions(cartUpdate)}

      </div>
    </div>
  );

    // return (
    //     <div className='col-md-3 mb-3'>
    //         <div className='card'>
    //             <div className='card-header'> 
    //                 {product.name}
    //             </div>
    //             <div className='card-body'>
    //                 <ShowImage item={product} url='product' />
    //                 <p>{product.description.substring(0, 100)}...</p>
    //                 <p>${product.price}</p>
                    
    //                 <Link to='/product/'>
    //                     <button className='btn btn-outline-primary my-2 btn-sm'>View Product</button>
    //                     <button className='btn btn-outline-warning my-2 btn-sm'>Add to Cart</button>
    //                 </Link>
    //             </div>
    //         </div>
    //     </div>
    // )
} 

export default Card;