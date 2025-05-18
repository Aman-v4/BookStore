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
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Navbar/>
        <Routes>
          <Route path="/" element={<Landing_page />} />
          <Route path="/Explore" element={<Explore />} />
          <Route path="/Wishlist" element={<Wishlist />} />  
          <Route path="/Cart" element={<Cart />} />
          <Route path="/Orders" element={<Orders />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/product/:id" element={<ProductPage />} /> 
        </Routes>
      <Footer/>
    </AuthProvider>
  )
}

export default App