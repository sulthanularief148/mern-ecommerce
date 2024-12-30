import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ShopContextProvider from './context/ShopContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ShopContextProvider>
    <ToastContainer />
      <App />
    </ShopContextProvider>
  </BrowserRouter>
)
