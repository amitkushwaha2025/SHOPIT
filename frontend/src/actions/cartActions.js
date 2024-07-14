import axios from "axios";
import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO } from '../constants/cartConstants';

export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
    // Fetch product data from API
    const { data } = await axios.get(`/api/v1/product/${id}`);

    // Dispatch action to update cart
    dispatch({
        type: ADD_TO_CART,
        payload: {
            product: data.product._id,
            name: data.product.name,
            price: data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity
        }
    });

    // Save updated cart to local storage
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

export const removeItemFromCart = (id) => async (dispatch, getState) => {

    // Dispatch action to update cart
    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
    });

    // Save updated cart to local storage
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};


export const saveShppingInfo = (data) => async (dispatch) => {

    // Dispatch action to update cart
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data
    });

    // Save updated cart to local storage
    localStorage.setItem("shippingInfo", JSON.stringify(data));
};
