import { API } from "../config";
import queryString from "query-string";

// Getting all products from backend with a limit of 6
export const getProducts = sortBy => {
    return fetch(`${API}/products?sortBy=${sortBy}&order=desc&limit=6`, {
        method: "GET"
    })
    // If successful, we return the first 6 products per sort by
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

// Getting all the filtered products either by categories or price
export const getFilteredProducts = (skip, limit, filters = {}) => {
    const data = {
        limit,
        skip,
        filters
    };
    return fetch(`${API}/products/by/search`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    // Returning all the responses from backend
    .then(response => {
         return response.json();
    })
    .catch(err => {
        console.log(err);
    });
};

// Listing all products by the search
export const list = params => {
    const query = queryString.stringify(params);
    console.log("query", query);
    return fetch(`${API}/products/search?${query}`, {
        method: "GET"
    })
    // Return all the products that fit the query
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

// Reading a single product from the database
export const read = productId => {
    return fetch(`${API}/product/${productId}`, {
        method: "GET"
    })
    // Return the product that fits the productId from React
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

// Listing all the products that are related (by categories) from backend
export const listRelated = productId => {
    return fetch(`${API}/products/related/${productId}`, {
        method: "GET"
    })
    // Returning products of the same category
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

// Read all categories
export const getCategories = () => {
    return fetch(`${API}/categories`, {
        method: 'GET'
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

// Read cart
export const readCart = (userId, token) => {
    return fetch(`${API}/cart/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
    });
};


// Adding products to Cart 
export const addProductCart = (userId, token, productId) => {
    return fetch(`${API}/cart/${userId}`, {
        method: 'POST',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        // Populating the req.body with the user variables
        body:JSON.stringify(productId)
    })
    .then(response => {
        // Returning same data with additional info such as error back to signin.js
        console.log("The adding cart part worked!!!");
    })
    .catch(err => {
        console.log("Adding to Cart worked!!!")
        console.log(err)
    })
}

// Adding product to Cart
export const updateCart = (userId, token, productId, quantity) => {
    return fetch(`${API}/cart/${userId}`, {
        method: 'PUT',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        // Populating the req.body with the user variables
        body:JSON.stringify({quantity, productId})
    })
    .then(response => {
        // Returning same data with additional info such as error back to signin.js
        console.log("The adding cart part worked!!!");
    })
    .catch(err => {
        console.log("Adding to Cart worked!!!")
        console.log(err)
    })
}

// Adding product to Cart
export const removeCartProduct = (userId, token, productId) => {
    return fetch(`${API}/cart-delete-item/${userId}`, {
        method: 'delete',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        // Populating the req.body with the user variables
        body:JSON.stringify(productId)
    })
    .then(response => {
        // Returning same data with additional info such as error back to signin.js
        return response.json();
        // console.log("Deleting Cart is working");
    })
    .catch(err => {
        console.log("Deleting cart item")
        console.log(err)
    })
}


export const getBraintreeClientToken = (userId, token) => {
    return fetch(`${API}/braintree/getToken/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

export const processPayment = (userId, token, paymentData) => {
    return fetch(`${API}/braintree/payment/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(paymentData)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const createOrder = (userId, token, createOrderData) => {
    return fetch(`${API}/order/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ order: createOrderData })
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};