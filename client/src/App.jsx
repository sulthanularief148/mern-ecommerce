import { Routes, Route, Navigate } from "react-router-dom"
import {
  Home, About, Contact, Product, Login, Collection, Cart, Checkout, Order, OrderSuccess,
  Profile, Search, Verify, Wishlist, ForgotPassword, ResetPassword,
  ShippingPolicy, ReturnPolicy, CancellationPolicy, PrivacyPolicy, Terms, CookiePolicy, FAQ, NotFound,
} from "./pages"
import { Layout } from "./components"


const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productsId" element={<Product />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/shop" element={<Collection />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/place-order" element={<Navigate to="/checkout" replace />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order/success/:id" element={<OrderSuccess />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/cancellation-policy" element={<CancellationPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route element={<Verify />} path="/verify" />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
export default App
