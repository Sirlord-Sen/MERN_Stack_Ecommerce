import React, {useState} from "react";
import Layout from '../core/Layout';
import { Redirect } from 'react-router-dom';
import {signinBackendConnect, authenticate, isAuthenticated} from '../auth/index';

const Signin = () => {
    //Craeting sign in state with React Hooks
    const [values, setValues] = useState({
        email: 'lodwaf12@gmail.com',
        password: 'qwerty12345',
        error: '',
        loading: false,
        redirectToReferer: false
    });

    // Making the state variables available in the working document by their respective names
    const { email, password, error, loading, redirectToReferer} = values;

    const { user } = isAuthenticated()

    // When there is a change of event, store values ini respective state variables
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    // Clicking Signin submit
    const clickSignin = (event) => {

        // To prevent the default of refreshing page when submit button is clicked
        event.preventDefault();

        // Set Error to false and loading to true when button is clicked once more
        setValues({...values, error: false, loading: true});

        // Call function that connects incoming form data to the backend
        signinBackendConnect({ email: email, password: password })

            // Returns the data from the above function if connecting to the DB actually worked!
            .then(data => {
                if(data.error){

                    // If there is an error from backend, set that error to state error and loading as false
                    setValues({...values, error: data.error, loading: false})
                } else {

                    // If no error, Authenticate user!
                    authenticate(data, () => {

                        // If the data has been stored in local storage, then set redirect to true
                        setValues({
                            ...values,
                            redirectToReferer: true
                        });
                    })
                }    
            })
            .catch()
    }

    const signInForm = () => (
        <form className='mb-5'>

            <div className="form-group">
                <label className='text-muted'>Email</label>
                <input 
                    onChange={handleChange('email')} 
                    type='email' 
                    className='form-control' 
                    value={ email }
                />
            </div>

            <div className="form-group">
                <label className='text-muted'>Password</label>
                <input 
                    onChange={handleChange('password')} 
                    type='password' 
                    className='form-control' 
                    value={ password }
                />
            </div>

            <button onClick={clickSignin} className="btn btn-sm btn-primary">Submit</button>
        </form>
    )

    // Showing the Error message if error is true since error only becomes true when there is an error from backend
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    // If button is clicked, then show the loading page
    const showLoading = () => (
        loading && (
            <div className="alert alert-info">
                <h2>Loading...</h2>
            </div>
        )
    );

    // If everything worked and local storage has data, then redirect to the home page
    const redirectUSer = () => {
        if(redirectToReferer){
            if(user && user.role === 1){
                return <Redirect to='/admin/dashboard'/>;
            } else {
                return <Redirect to='/user/dashboard' />
            }
        }
    };


    return (
        <Layout 
        title='Sign in' 
        description='Signin to your Palmvate acoount'
        className="col-md-8 offset-md-2">
            { showLoading() }
            { showError() }
            { signInForm() }
            { redirectUSer() }
         </Layout>
    )
}
    

export default Signin;