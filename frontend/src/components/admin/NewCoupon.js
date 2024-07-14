import React, { Fragment, useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { clearErrors, newCoupon } from '../../actions/couponAction';
import { CREATE_COUPON_RESET } from '../../constants/couponConstants';
import Sidebar from './Sidebar';
import MetaData from '../layout/MetaData';


const NewCoupon = () => {

    const navigate = useNavigate();
    const alert = useAlert();
    const dispatch = useDispatch()
    const [couponCode,setCouponCode] = useState('');
    const [percentage,setPercentage] = useState('');

    const {loading , error, success} = useSelector((state) => state.newCoupon)

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch(clearErrors());
        }
        if (success) {
            navigate('/admin/coupons');
            alert.success('coupon created successfully');
            dispatch({ type: CREATE_COUPON_RESET });
        }
    },[dispatch,error,success,alert,navigate])

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('couponCode', couponCode);
        formData.set('percentage', percentage);

        dispatch(newCoupon(formData));
    };


  return (
    <Fragment>
            <MetaData title={'New Coupon'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">New Product</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Coupon Code</label>
                                    <input
                                        type="text"
                                        id="coupon_code_field"
                                        className="form-control"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price_field">Percentage</label>
                                    <input
                                        type="text"
                                        id="percentage_field"
                                        className="form-control"
                                        value={percentage}
                                        onChange={(e) => setPercentage(e.target.value)}
                                    />
                                </div>
                                <button
                                    id="create_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading ? true : false}
                                >
                                    CREATE
                                </button>
                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>
        </Fragment>
  )
}

export default NewCoupon