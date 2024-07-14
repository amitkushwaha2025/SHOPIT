import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import CheckoutSteps from './CheckoutSteps';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../layout/Loader';
import { allcoupons } from '../../actions/couponAction';

const ConfirmOrder = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState(''); // New state for coupon message

    const { cartItems, shippingInfo } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const { coupons, loading } = useSelector(state => state.allcoupon);
    useEffect(()=>{
        dispatch(allcoupons())
    },[dispatch])

    // Calculate Order Prices
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2);
    const shippingPrice = itemsPrice > 200 ? 0 : 25;
    const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
    const discountAmount = (itemsPrice * (discount / 100)).toFixed(2);
    const totalPayable = (itemsPrice - discountAmount).toFixed(2);
    const totalPrice = (Number(totalPayable) + shippingPrice + taxPrice).toFixed(2);

    const processToPayment = () => {
        const data = {
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice
        };
        sessionStorage.setItem('orderInfo', JSON.stringify(data));
        navigate('/payment');
    };

    const applyCoupon = () => {
        console.log(`Attempting to apply coupon: "${couponCode}"`);
        console.log("Available coupons:", coupons);
        
        const coupon = coupons.find(c => c.couponCode.trim() === couponCode.trim());
        if (coupon) {
            setDiscount(coupon.percentage);
            setCouponMessage(`Coupon applied: ${coupon.couponCode}, Discount: ${coupon.percentage}%`);
            console.log(`Coupon applied: ${coupon.couponCode}`);
        } else {
            setDiscount(0);
            setCouponMessage('Invalid coupon code.');
            console.log('Invalid coupon code.');
        }
    };

    return (
        <Fragment>
            <MetaData title={'Confirm Order'} />
            <CheckoutSteps shipping confirmOrder />
            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">
                    <h4 className="mb-3">Shipping Info</h4>
                    <p><b>Name:</b> {user && user.name}</p>
                    <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
                    <p className="mb-4"><b>Address:</b> {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}</p>

                    <h4 className="mt-4">Your Cart Items:</h4>
                    {cartItems.map(item => (
                        <Fragment key={item.product}>
                            <hr />
                            <div className="cart-item my-1">
                                <div className="row">
                                    <div className="col-4 col-lg-2">
                                        <img src={item.image} alt="Product" height="45" width="65" />
                                    </div>
                                    <div className="col-5 col-lg-6">
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </div>
                                    <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                        <p>{item.quantity} x ${item.price} = <b>${(item.quantity * item.price).toFixed(2)}</b></p>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </Fragment>
                    ))}
                </div>

                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal: <span className="order-summary-values">${itemsPrice}</span></p>
                        <p>Shipping: <span className="order-summary-values">${shippingPrice}</span></p>
                        
                        {loading ? (
                            <Loader />
                        ) : (
                            discount > 0 && (
                                <div>
                                    <p>Discount: <span className="order-summary-values">{discount}%</span></p>
                                    <p>Coupon Discount: <span className="order-summary-values">-${discountAmount}</span></p>
                                    <p>After Discount: <span className="order-summary-values">${totalPayable}</span></p>
                                </div>
                            )
                        )}
                        <p>Tax: <span className="order-summary-values">${taxPrice}</span></p>
                        <label htmlFor="coupon_code_field">Apply Coupon: </label>
                        <div className="input-group">
                            <input
                                type="text"
                                id="coupon_code_field"
                                className="form-control"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <button className="btn btn-secondary" onClick={applyCoupon}>Apply</button>
                        </div>
                        {couponMessage && <div className="alert alert-info mt-2">{couponMessage}</div>} {/* Coupon message display */}
                        <hr />
                        
                        <p>Total: <span className="order-summary-values">${totalPrice}</span></p>
                        <hr />
                        <button id="checkout_btn" className="btn btn-primary btn-block" onClick={processToPayment}>
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ConfirmOrder;
