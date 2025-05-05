import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Explore from './Pages/Explore.jsx'
import Wishlist from './Pages/Wishlist.jsx'
import Cart from './Pages/Cart.jsx'
import Orders from './Pages/Orders.jsx'
import Login from './Pages/Login.jsx'


const router = createBrowserRouter([
  {
    element: <App />,
    path: "/"
  },
  {
    element: <Explore />,
    path: "/Explore"
  },
  {
    element: <Wishlist/>,
    path: "/Wishlist"
  },
  {
    element: <Cart/>,
    path: "/Cart"
  },
  {
    element: <Orders/>,
    path: "/Orders"
  },
  {
    element: <Login/>,
    path: "/Login"
  },

])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <RouterProvider router={router} />
  </StrictMode>,
)