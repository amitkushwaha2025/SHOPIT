import React, { Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'

import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { allcoupons, clearErrors,deleteCouponCode } from '../../actions/couponAction'
import { DELETE_COUPON_RESET } from '../../constants/couponConstants'

const CouponList = () => {

    const navigate = useNavigate()
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, coupons } = useSelector(state => state.allcoupon);
    const { isDeleted } = useSelector(state => state.deleteCoupon)

    useEffect(() => {
        dispatch(allcoupons());

        if (error) {
            alert.error(error);
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success('Coupon deleted successfully');
            navigate('/admin/coupons');
            dispatch({ type: DELETE_COUPON_RESET })
        }

    }, [dispatch, alert, error,isDeleted, navigate])

    const deleteCouponHandler = (id) => {
        dispatch(deleteCouponCode(id))
    }

    const setCoupons = () => {
        const data = {
            columns: [
                {
                    label: 'User ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'CouponCode',
                    field: 'couponcode',
                    sort: 'asc'
                },
                {
                    label: 'Percentage',
                    field: 'percentage',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        coupons && coupons.forEach(coupon => {
            data.rows.push({
                id: coupon._id,
                couponcode: coupon.couponCode,
                percentage: coupon.percentage,
                actions: <Fragment>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteCouponHandler(coupon._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })

        return data;
    }

  return (
    <Fragment>
            <MetaData title={'All Coupons'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Coupons</h1>

                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setCoupons()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}

                    </Fragment>
                </div>
            </div>

        </Fragment>
  )
}

export default CouponList