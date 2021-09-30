import {API} from '../config';

// Taking the sign up form data from signup.js as user
export const signupBackendConnect = (user) => {

    // Backend connection
    return fetch(`${API}/signup`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        },

        // Populating the req.body with the user variables
        body:JSON.stringify(user)
    })
    .then(response => {
        // Returning same data with additional info such as error back to signup.js
        return response.json();
    })
    .catch(err => {
        console.log(err)
    })
}

// Taking the sign in form data from signin.js as user
export const signinBackendConnect = (user) => {

    // Backend connection
    return fetch(`${API}/signin`, {
        method: "POST",
        headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
        },

        // Populating the req.body with the user variables
        body:JSON.stringify(user)
    })
    .then(response => {
        // Returning same data with additional info such as error back to signin.js
        return response.json();
    })
    .catch(err => {
        console.log(err)
    })
}

// Taking the signout route
export const signout = next => {

    // If the window object exists
    if (typeof window !== 'undefined') {

        // Remove the store jwt from the local storage just before the backend even makes it unavailable with signout
        localStorage.removeItem('jwt');
        next();

        // Then, go to the backend and remove jwt from being returned
        return fetch(`${API}/signout`, {
            method: 'GET'
        })
        // Pass the success response from backeend
        .then(response => {
                console.log('Signout: ', response);
            })
        .catch(err => console.log(err));
    }
};


export const authenticate = (data, next) => {
    // If window object that stores data is available, Store the data in the local storage
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(data));
        next();
    }
};


export const isAuthenticated = () => {
    // If the window document is not available then return false
    if (typeof window == 'undefined') {
        return false;
    }
    
    // There is a jwt data in the local storage, meaning one is logged in.
    if (localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'));
    } else {
        return false;
    }
};