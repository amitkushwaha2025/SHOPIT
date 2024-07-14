import React, { Fragment, useEffect, useState } from 'react'
import MetaData from './layout/MetaData'
import Pagination from "react-js-pagination";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/productActions'
import Product from './product/Product'
import Loader from './layout/Loader'
import { useAlert } from 'react-alert'
import { useParams } from 'react-router-dom';

const Home = () => {
    const [currentPage, setcurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 10000])
    const [category, setCategory] = useState('')
    const [rating, setRating] = useState(0);
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, products, error, resPerPage, productsCount, filteredProductsCount } = useSelector(state => state.products)


    const { keyword } = useParams();
    const categories = [
        'Electronics',
        'Cameras',
        'Laptop',
        'Accessories',
        'headphones',
        'Food',
        "Books",
        'Clothes/Shoes',
        "Beauty/Health",
        'Sports',
        'Outdoor',
        'Home'
    ]

    useEffect(() => {
        if (error) {
            return alert.error(error)
        }
        dispatch(getProducts(keyword, currentPage, price, category, rating));



    }, [dispatch, error, keyword, alert, currentPage, price, category, rating])

    function setCurrentPageNo(pageNumber) {
        setcurrentPage(pageNumber)
    }
    let count = productsCount;
    if (keyword) {
        count = filteredProductsCount
    }
    // Helper function to shuffle an array
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    // Shuffle the products array and slice to get a maximum of 4 products
    const randomProducts = products ? shuffleArray([...products]) : [];

    return (

        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={"Buy best prducts online"} />
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" class="container mt-5">
                        <div class="row">
                            {
                                keyword ? (
                                    <Fragment>
                                        <div className='col-6 col-md-3 mt-5 mb-5'>
                                            <div className='px-5'>
                                                <Slider range
                                                    marks={{
                                                        1: `$1`,
                                                        1000: `$1000`
                                                    }}
                                                    min={1}
                                                    max={1000}
                                                    defaultValue={[1, 1000]}
                                                    tipFormatter={value => `$${value}`}
                                                    tipProps={{
                                                        placement: "top",
                                                        visible: true
                                                    }}
                                                    value={price}
                                                    onChange={price => setPrice(price)}
                                                />
                                                <hr className='my-5' />


                                                <div className="mt-5">
                                                    <h4 className="mb-3">
                                                        Categories
                                                    </h4>

                                                    <ul className="pl-0">
                                                        {categories.map(category => (
                                                            <li
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    listStyleType: 'none'
                                                                }}
                                                                key={category}
                                                                onClick={() => setCategory(category)}
                                                            >
                                                                {category}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <hr className='my-3' />


                                                <div className="mt-5">
                                                    <h4 className="mb-3">
                                                        rating
                                                    </h4>

                                                    <ul className="pl-0">
                                                        {[5, 4, 3, 2, 1].map(star => (
                                                            <li
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    listStyleType: 'none'
                                                                }}
                                                                key={star}
                                                                onClick={() => setRating(star)}
                                                            >
                                                                <div className="rating-outer">
                                                                    <div className="rating-inner"
                                                                        style={{
                                                                            width: `${star * 20}%`
                                                                        }}
                                                                    >
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                            </div>

                                        </div>
                                        <div className='col-6 col-md-9'>
                                            <div className='row'>
                                                {
                                                    randomProducts.map(product => (
                                                        <Product key={product._id} product={product} col={4} />
                                                    ))
                                                }

                                            </div>

                                        </div>
                                    </Fragment>
                                ) : (
                                    randomProducts.map(product => (
                                        <Product key={product._id} product={product} col={3} />
                                    ))
                                )
                            }
                        </div>
                    </section>

                    {resPerPage <= count && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                itemsCountPerPage={resPerPage}
                                totalItemsCount={productsCount}
                                onChange={setCurrentPageNo}
                                nextPageText={'Next'}
                                prevPageText={'Prev'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    )}


                </Fragment>
            }
        </Fragment>
    )
}

export default Home
