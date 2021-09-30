import React, {useState, useEffect} from 'react';
import Layout from './Layout';
import { getProducts } from './apiCore';
import Card from './Card';
import Search from './Search';

const Home = () => {

    // Craeting states with hooks
    const [productsBySell, setProductsBySell] = useState([]);
    const [productsByArrival, setProductsByArrival] = useState([]);
    const [error, setError] = useState(false);

    // Function for loading products by highest sold 
    const loadProductsBySell = () => {

        // Grab all products with limit of 6 and sort of 'sold'
        getProducts('sold').then(data => {

            // If there is an error while fetching, populate the error state with incoming error
            if (data.error) {
                setError(data.error);
            } else {
                // Populate productsBySell state with the data
                setProductsBySell(data);
            }
        });
    };

    // Function for loading products by recently created
    const loadProductsByArrival = () => {

        // Grab all products with limit of 6 and sort of 'createdAt'
        getProducts('createdAt').then(data => {

            // If there is an error while fetching, populate the error state with incoming error
            if (data.error) {
                setError(data.error);
            } else {

                // Populate productsByArrival state with the data
                setProductsByArrival(data);
            }
        });
    };

    useEffect(() => {
        loadProductsByArrival();
        loadProductsBySell();
    }, []);

    return(
        <Layout 
            title='PalmVate' 
            description='This is a special ecommerce platform that helps you with everything you need'
            className='container'>    

                <Search />
                <h2 className="mb-4">New Arrivals</h2>
                <div className="row">
                    {productsByArrival.map((product, i) => (
                       <div key={i} className='col-md-4'>
                            <Card  product={product} />
                        </div>
                    ))}   
                </div>

                <h2 className="mb-4">Best Sellers</h2>
                <div className="row">
                    {productsBySell.map((product, i) => (
                       <div key={i} className='col-md-4'>
                           <Card  product={product} />
                        </div>                    
                    ))}                    
                </div>
        </Layout>
    )
}

export default Home;