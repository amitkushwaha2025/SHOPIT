const express = require("express");
const { newProduct, getProduct, getSingleProduct, updateProduct, deleteProduct, createProductReviwe, getProductReviwe, deleteReviwe, getAdminProduct } = require("../controllers/productscontroller");
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth");

const router = express.Router();



router.get("/products", getProduct); 
router.get("/admin/products",getAdminProduct); 
router.post("/admin/product/new",isAuthenticatedUser,authorizeRoles("admin"),newProduct)
router.route('/product/:id').get(getSingleProduct);
router.put("/admin/product/:id",isAuthenticatedUser,authorizeRoles("admin"),updateProduct);
router.delete("/admin/product/:id",isAuthenticatedUser,authorizeRoles("admin"),deleteProduct);
router.put("/review",isAuthenticatedUser,createProductReviwe);
router.get("/reviews",isAuthenticatedUser,getProductReviwe);
router.delete("/review/",isAuthenticatedUser,deleteReviwe);

module.exports = router;