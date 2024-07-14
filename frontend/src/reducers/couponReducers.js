
import { ALL_COUPON_FAIL, 
    ALL_COUPON_REQUEST, 
    ALL_COUPON_SUCCESS,
    CLEAR_ERRORS,
    CREATE_COUPON_FAIL,
    CREATE_COUPON_REQUEST,
    CREATE_COUPON_RESET,
    CREATE_COUPON_SUCCESS,
    DELETE_COUPON_REQUREST,
    DELETE_COUPON_SUCCESS} from "../constants/couponConstants"
import { DELETE_ORDER_FAIL, DELETE_ORDER_RESET } from "../constants/orderConstants"



export const allCouponReducer = (state={coupons:[]},action)=>{
    switch(action.type){
        case ALL_COUPON_REQUEST:
            return{
                ...state,
                loading:true
            }

        case ALL_COUPON_SUCCESS:
            return{
                ...state,
                loading :false,
                coupons:action.payload.coupons,
            }
        case ALL_COUPON_FAIL:
            return{
                loading:false,
                error:action.payload
            }
        case CLEAR_ERRORS:
            return{
                ...state,
                error:null,
            }
        default:

            return state
    }
}
export const deleteCouponReducer = (state={},action)=>{
    switch(action.type){
        case DELETE_COUPON_REQUREST:
            return{
                ...state,
                loading:true
            }

        case DELETE_COUPON_SUCCESS:
            return{
                ...state,
                loading :false,
                isDeleted:action.payload,
            }
        case DELETE_ORDER_RESET:
            return{
                ...state,
                loading :false,
                isDeleted:false,
            }
        case DELETE_ORDER_FAIL:
            return{
                loading:false,
                error:action.payload
            }
        case CLEAR_ERRORS:
            return{
                ...state,
                error:null,
            }
        default:

            return state
    }
}

export const newCouponReducer = (state = { coupon: {} }, action) => {
    switch (action.type) {
        case CREATE_COUPON_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        case CREATE_COUPON_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                coupon: action.payload.coupon
            };

        case CREATE_COUPON_RESET:
            return {
                ...state,
                success: false
            };

        case CREATE_COUPON_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            };

        default:
            return state;
    }
};