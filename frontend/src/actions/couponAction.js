import axios from "axios"
import { ALL_COUPON_FAIL, ALL_COUPON_REQUEST, ALL_COUPON_SUCCESS, CLEAR_ERRORS, CREATE_COUPON_FAIL, CREATE_COUPON_REQUEST, CREATE_COUPON_SUCCESS, DELETE_COUPON_FAIL, DELETE_COUPON_REQUREST, DELETE_COUPON_SUCCESS } from "../constants/couponConstants"

// all coupons by admin 
export const allcoupons = () => async (dispatch)=>{
    try{
        dispatch({type:ALL_COUPON_REQUEST})
        const {data} = await axios.get('/api/v1/admin/coupons')

        dispatch({
            type:ALL_COUPON_SUCCESS,
            payload:data
        })

    }catch(error){
        dispatch({
            type:ALL_COUPON_FAIL,
            payload:error.response.data.message

        })
    }
}

export const deleteCouponCode = (id) => async (dispatch)=>{
    try{
        dispatch({type:DELETE_COUPON_REQUREST})
        const {data} = await axios.delete(`/api/v1/admin/delete/coupon/${id}`)

        dispatch({
            type:DELETE_COUPON_SUCCESS,
            payload:data.success
        })

    }catch(error){
        dispatch({
            type:DELETE_COUPON_FAIL,
            payload:error.response.data.message

        })
    }
}
export const newCoupon = (couponData) => async (dispatch)=>{
    try{
        dispatch({type:CREATE_COUPON_REQUEST})
        const config = {
            headers:{
                "Content-Type" : 'application/json'
            }
        }
        const {data} = await axios.post(`/api/v1/admin/create/coupon`,couponData,config)

        dispatch({
            type:CREATE_COUPON_SUCCESS,
            success:true,
            payload:data
        })

    }catch(error){
        dispatch({
            type:CREATE_COUPON_FAIL,
            payload:error.response.data.message

        })
    }
}
// clear errors 
export const clearErrors =()=> async(dispatch)=>{
    dispatch({
        type: CLEAR_ERRORS
    })
}