import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Explore from './Pages/Explore.jsx';
import Wishlist from './Pages/Wishlist.jsx';
import Cart from './Pages/Cart.jsx';
import Orders from './Pages/Orders.jsx';
import Login from './Pages/Login.jsx';
import ProductPage from './Pages/ProductPage.jsx';
import { CartProvider } from './Context/CartContext.jsx';
import { WishlistProvider } from './Context/WishlistContext.jsx'; 
import { Auth0Provider } from '@auth0/auth0-react';
import { UserDataProvider } from './Context/UserDataContext.jsx';


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
    element: <Wishlist />,
    path: "/Wishlist"
  },
  {
    element: <Cart />,
    path: "/Cart"
  },
  {
    element: <Orders />,
    path: "/Orders"
  },
  {
    element: <Login />,
    path: "/Login"
  },
  {
    element: <ProductPage />,
    path: "/product/:id"
  }
]);

createRoot(document.getElementById('root')).render(
  <Auth0Provider
          domain="dev-h5tjyw6sc0ba1xi5.us.auth0.com"
          clientId="FJeVlmZ07worFTTtl1prq7Iuk77w0x14"
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: "https://bookstore-api",
            scope: "read:current_user update:current_user_metadata",
          }}
        >
    <UserDataProvider>
      <CartProvider>
        <WishlistProvider> 
          
            <RouterProvider router={router} />
          
        </WishlistProvider>
      </CartProvider>
    </UserDataProvider>
  </Auth0Provider>
);
