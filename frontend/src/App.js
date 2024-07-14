import "./App.css";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import { loadUser } from "./actions/useActions";
import store from "./store";
import { useEffect, useState } from "react";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Payment from "./components/cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import OrderSuccess from "./components/cart/OrederSuccess";
import ListOrders from "./components/order/ListOrders";
import OrderDetails from "./components/order/OrderDetails";
import Dashboard from "./components/admin/Dashboard";
import ProductsList from "./components/admin/ProductsList";
import UpdateProduct from "./components/admin/UpdateProduct";
import NewProduct from "./components/admin/NewProduct";
import ProtectedRoute from "./components/route/ProtectedRoute";
import OrdersList from "./components/admin/OrdersList";
import ProcessOrder from "./components/admin/ProcessOrder";
import UsersList from "./components/admin/UsersList";
import UpdateUser from "./components/admin/UpdateUser";
import ProductReviews from "./components/admin/ProductReviews";
import { useSelector } from "react-redux";
import CouponList from "./components/admin/CouponList";
import NewCoupon from "./components/admin/NewCoupon";

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeApiKey() {
      try {
        const { data } = await axios.get("/api/v1/stripeapi");
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        console.error("Error fetching Stripe API key:", error);
      }
    }

    getStripeApiKey();
  }, []);

  const { isAuthenticated, user, loading } = useSelector(state => state.auth);

  return (
    <div className="App">
      <Header />
      <div className="container container-fluid">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search/:keyword" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/order/confirm" element={<ConfirmOrder />} />
          <Route path="/orders/me" element={<ListOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />
          <Route path="/success" element={<OrderSuccess />} />
          {stripeApiKey && (
            <Route
              path="/payment"
              element={
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <Payment />
                </Elements>
              }
            />
          )}
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/me" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile />} />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/password/forgot" element={<ForgotPassword />} />
          <Route path="/password/reset/:token" element={<NewPassword />} />
          <Route element={<ProtectedRoute isAdmin={true} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/products" element={<ProductsList />} />
            <Route path="/admin/product/:id" element={<UpdateProduct />} />
            <Route path="/admin/product/new" element={<NewProduct />} />
            <Route path="/admin/orders" element={<OrdersList />} />
            <Route path="/admin/order/:id" element={<ProcessOrder />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/user/:id" element={<UpdateUser />} />
            <Route path="/admin/reviews" element={<ProductReviews />} />
            <Route path="/admin/coupons" element={<CouponList />} />
            <Route path="/admin/coupon/new" element={<NewCoupon />} />
          </Route>
        </Routes>
      </div>
      {!loading && (!isAuthenticated || user.role === "admin")&&(
        <Footer />
      )}
      
    </div>
  );
}

export default App;
