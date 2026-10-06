import { Route, Routes, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import Dashboard from "./pages/Dashboard"
import Add from "./pages/Add"
import Edit from "./pages/Edit"
import List from "./pages/List"
import Orders from "./pages/Orders"
import Coupons from "./pages/Coupons"
import Discounts from "./pages/Discounts"
import Banners from "./pages/Banners"
import Collections from "./pages/Collections"
import Customers from "./pages/Customers"
import CustomerDetail from "./pages/CustomerDetail"
import Reviews from "./pages/Reviews"
import Returns from "./pages/Returns"
import Questions from "./pages/Questions"
import Settings from "./pages/Settings"
import AdminUsers from "./pages/AdminUsers"
import Stock from "./pages/inventory/Stock"
import LowStock from "./pages/inventory/LowStock"
import StockAdjustment from "./pages/inventory/StockAdjustment"
import SalesReport from "./pages/reports/Sales"
import ProductsReport from "./pages/reports/Products"
import CustomersReport from "./pages/reports/Customers"
import InventoryReport from "./pages/reports/Inventory"
import { useEffect, useState } from "react"
import Login from "./components/Login"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'
import { api, refreshAccessToken, setAccessToken } from "./lib/apiClient"
export { backendurl, currency } from './config'

function App() {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const token = await refreshAccessToken()
        if (token) {
          const res = await api.get('/api/auth/me')
          const me = res.data.data.user
          if (me.role === 'ADMIN' || me.role === 'SUPER_ADMIN') {
            setUser(me)
          } else {
            setAccessToken(null)
          }
        }
      } catch {
        setAccessToken(null)
      } finally {
        setAuthReady(true)
      }
    })()
  }, [])

  if (!authReady) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {
        !user ? <Login setUser={setUser} /> : (
          <>
            <Navbar user={user} setUser={setUser} />
            <hr />
            <div className="flex w-full">
              <Sidebar isSuperAdmin={user.role === 'SUPER_ADMIN'} />
              <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />

                  <Route path="/inventory/stock" element={<Stock />} />
                  <Route path="/inventory/low-stock" element={<LowStock />} />
                  <Route path="/inventory/adjust" element={<StockAdjustment />} />

                  <Route path="/add" element={<Add />} />
                  <Route path="/edit/:id" element={<Edit />} />
                  <Route path="/list" element={<List />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers/:id" element={<CustomerDetail />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/questions" element={<Questions />} />
                  <Route path="/coupons" element={<Coupons />} />
                  <Route path="/discounts" element={<Discounts />} />
                  <Route path="/banners" element={<Banners />} />
                  <Route path="/collections" element={<Collections />} />

                  <Route path="/reports/sales" element={<SalesReport />} />
                  <Route path="/reports/products" element={<ProductsReport />} />
                  <Route path="/reports/customers" element={<CustomersReport />} />
                  <Route path="/reports/inventory" element={<InventoryReport />} />

                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin-users" element={user.role === 'SUPER_ADMIN' ? <AdminUsers /> : <Navigate to="/dashboard" replace />} />

                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </div>
          </>
        )
      }
    </div>
  )
}

export default App
