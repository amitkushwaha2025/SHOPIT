import { createStore , applyMiddleware ,combineReducers } from 'redux';
import {thunk} from 'redux-thunk';

import { productsReducers,productDetailsReducer, newReviewReducer, newProductReducer, productReducer, productReviewsReducer, ReviewReducer } from './reducers/productReducers';
import { allUsersReducer, authReducer, forgotPasswordReducer, userDetailsReducer, userReducer } from './reducers/userReducers';
import { cartReducers } from './reducers/cartReducers';
import { allOrdersReducer, myOrederReducer, newOrderReducer, orderDetailsReducer, orderReducer } from './reducers/orderReducers';
import { allCouponReducer, deleteCouponReducer, newCouponReducer } from './reducers/couponReducers';



const reducer = combineReducers({

    products :productsReducers,
    productDetails:productDetailsReducer,
    newProduct:newProductReducer,
    product:productReducer,
    auth :authReducer,
    user:userReducer,
    allUsers:allUsersReducer,
    userDetails:userDetailsReducer,
    allOrders:allOrdersReducer,
    forgotPassword:forgotPasswordReducer,
    cart:cartReducers,
    newOrder:newOrderReducer,
    myOrders:myOrederReducer,
    orderDetails:orderDetailsReducer,
    order:orderReducer,
    newReview:newReviewReducer,
    review:ReviewReducer,
    productReviews:productReviewsReducer,
    allcoupon:allCouponReducer,
    deleteCoupon:deleteCouponReducer,
    newCoupon:newCouponReducer,
})

let initialState = {
    cart:{
        cartItems:localStorage.getItem("cartItems")?
        JSON.parse(localStorage.getItem("cartItems")):
        [],
        shippingInfo:localStorage.getItem("shippingInfo")?
        JSON.parse(localStorage.getItem("shippingInfo")):
        {}
    }
    
    
}

const middleware = [thunk];
const store = createStore(
    reducer,
    initialState,
    applyMiddleware(...middleware)  // Without composeWithDevTools
);

export default store;