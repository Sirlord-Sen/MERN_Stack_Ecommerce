import React from "react";
import { Route, Redirect } from "react-router-dom";
import { isAuthenticated } from "./index";

const SigninRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            !isAuthenticated()  ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to= {
                        isAuthenticated().user.role === 1 ? 
                            { pathname: '/admin/dashboard' } : 
                            { pathname: '/user/dashboard' } 
                        }
                />
            )
        }
    />
);

export default SigninRoute;