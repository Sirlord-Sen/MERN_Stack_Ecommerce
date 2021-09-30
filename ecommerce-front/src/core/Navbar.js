import React, {Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {signout, isAuthenticated} from '../auth'

const isActive = (history, path) => {
    if(history.location.pathname === path){
        return {color: '#ff9900'}
    } else {
        return {color: '#ffffff'}
    }
}

const Navbar = ({history}) => (
    <nav className="navbar navbar-expand-md navbar-dark bg-primary">
        <div className="container-fluid">
            <Link className="navbar-brand" style={isActive(history, '/')} to="/">PalmVate</Link>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-toggle="collapse" 
                    data-target="#navbarSupportedContent">
                        <span className="navbar-toggler-icon"></span>
                </button>
        
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav">

                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    style={isActive(history, "/shop")}
                                    to="/shop">
                                    Shop
                                </Link>
                            </li>
                            
                            {isAuthenticated() && isAuthenticated().user.role === 0 && (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        style={isActive(history, "/user/dashboard")}
                                        to="/user/dashboard"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                            )}

                            {isAuthenticated() && isAuthenticated().user.role === 1 && (
                                <li className="nav-item">
                                    <Link
                                        className="nav-link"
                                        style={isActive(history, "/admin/dashboard")}
                                        to="/admin/dashboard"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                            )}

                            {!isAuthenticated() && (
                                <Fragment>
                                    <li className="nav-item mr-3">
                                        <Link 
                                            className="nav-link" 
                                            style={isActive(history, '/signin')} 
                                            to="/signin">
                                                Sign in
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link 
                                            className="nav-link" 
                                            style={isActive(history, '/signup')} 
                                            to='/signup'>
                                                Sign Up
                                        </Link>
                                    </li> 
                                </Fragment>
                            )}
                            {isAuthenticated() && (
                                <li className="nav-item">
                                    <span
                                        className="nav-link"
                                        style={{ cursor: "pointer", color: "#ffffff" }}
                                        onClick={() =>
                                            signout(() => {
                                                history.push("/");
                                            })
                                        }>
                                        Signout
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div>
            </div>
        </nav>
)

export default withRouter(Navbar);