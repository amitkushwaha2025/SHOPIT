const express = require('express');
const { coupon, couponDelete, getAllCoupon } = require('../controllers/couponControler');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();


router.post("/admin/create/coupon" ,isAuthenticatedUser,authorizeRoles('admin'),coupon)
router.delete("/admin/delete/coupon/:id" ,isAuthenticatedUser,authorizeRoles('admin'),couponDelete)
router.get("/admin/coupons" ,isAuthenticatedUser,authorizeRoles('admin'),getAllCoupon)


module.exports = router;