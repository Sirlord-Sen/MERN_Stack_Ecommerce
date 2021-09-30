import React, {useState} from "react";
import Layout from '../core/Layout';
import {Link} from 'react-router-dom';
import {signupBackendConnect} from '../auth/index';

const Signup = () => {
    // Using Hooks to create state
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        success: false
    });

    // Making the state variables available in the working document by their respective names
    const { name, email, password, success, error } = values;

    // When there is a change of event, store values ini respective state variables
    const handleChange = name => event => {
        setValues({ ...values, error: false, [name]: event.target.value });
    };

    // Clicking Signup submit
    const clickSignUp = (event) => {

        // To prevent the default of refreshing page when submit button is clicked
        event.preventDefault();

        // Set Error to false when button is clicked once more
        setValues({...values, error: false});

        // Call function that connects incoming form data to the backend
        signupBackendConnect({name: name, email: email, password: password})
            // Returns the data from the above function if connecting to the DB actually worked!
            .then(data => {
                if(data.error){
                    // If there is an error, set error to the error from the backend data and set success to false
                    setValues({...values, error: data.error, success: false})
                } else {

                    // If no error, then empty the state variables and set success to true
                    setValues({
                        ...values,
                        name: '',
                        email: '',
                        password: '',
                        error: '',
                        success: true
                    });
                }    
            })
            .catch()
    }

    const signUpForm = () => (
        <form className='mb-5'>
            <div className="form-group">
                <label className='text-muted'>Name</label>
                <input 
                    onChange={handleChange('name')} 
                    type='text' 
                    className='form-control' 
                    value={ name }
                />
            </div>

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

            <button onClick={clickSignUp} className="btn btn-sm btn-primary">Submit</button>
        </form>
    )

    // Showing the Error message if error is true since error only becomes true when there is an error from backend
    const showError = () => (
        <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
        </div>
    );

    // Showing the a message if sign up from backend was successful 
    const showSuccess = () => (
        <div className="alert alert-info" style={{ display: success ? '' : 'none' }}>
            New account is created. Please <Link to="/signin">Signin</Link>
        </div>
    );


    return (
        <Layout 
        title='Sign up' 
        description='Craete an acoount with Palmvate'
        className="col-md-8 offset-md-2">
            { showSuccess() }
            { showError() }
            { signUpForm() }
         </Layout>
    )
}
    

export default Signup;