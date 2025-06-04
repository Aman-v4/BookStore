import React from 'react'
import {Route, Routes } from 'react-router-dom' 
import Footer from './Components/Footer'
import Navbar from './Components/Navbar'
import Landing_page from './Pages/Landing_page'
import Explore from './Pages/Explore'
import Wishlist from './Pages/Wishlist'
import Cart from './Pages/Cart'
import Orders from './Pages/Orders'
import Login from './Pages/Login'
import ProductPage from './Pages/ProductPage'
import OrderSuccess from './Pages/OrderSuccess'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Landing_page />} />
            <Route path="/Explore" element={<Explore />} />
            <Route path="/Wishlist" element={<Wishlist />} />  
            <Route path="/Cart" element={<Cart />} />
            <Route path="/Orders" element={<Orders />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
          <Footer/>
          <ToastContainer position="bottom-right" autoClose={3000} />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App