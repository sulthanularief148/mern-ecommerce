import { Routes, Route } from "react-router-dom"
import { Home, About, Contact, Product, Login, Collection, Cart, PlaceOrder, Order, Verify } from "./pages"
import { Layout } from "./components"


const App = () => {
  return (<>
    <div className="px-4 sm:px-[5vw] lg:px-[7vw]">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productsId" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/orders" element={<Order />} />
          <Route element={<Verify />} path="/verify" />
        </Routes>
      </Layout>
    </div>
  </>);
}
export default App
