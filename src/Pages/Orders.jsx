// Orders.jsx
import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import axios from 'axios';

const Orders = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get('http://localhost:5000/api/userdata', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 md:px-16 lg:px-32 py-12 bg-gray-100">
        <h1 className="text-3xl font-bold mb-10 text-center">Your Orders</h1>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-lg font-semibold mb-2">Order #{index + 1}</h2>
                <div className="grid grid-cols-12 gap-4 text-sm text-gray-600 border-b pb-2">
                  <div className="col-span-6">Item</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>
                {order.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 py-2 border-b text-sm">
                    <div className="col-span-6 font-medium flex items-center gap-2">
                      <img src={item.image} alt={item.name} className="w-10 h-14 object-cover rounded" />
                      {item.name}
                    </div>
                    <div className="col-span-2 text-center">{item.quantity || 1}</div>
                    <div className="col-span-2 text-center">₹{item.price}</div>
                    <div className="col-span-2 text-center font-semibold text-green-700">
                      ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Orders;
