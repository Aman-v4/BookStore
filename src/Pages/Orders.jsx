import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading orders...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6">
        <h2 className="text-2xl font-semibold mb-6">Please login to view your orders</h2>
        <Link to="/Login" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg mb-4">You haven't placed any orders yet.</p>
            <Link to="/Explore" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Explore Books
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="ml-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap -mx-2">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item._id} className="px-2 mb-2">
                        <div className="w-16 h-20 bg-gray-100 flex items-center justify-center overflow-hidden rounded">
                          <img
                            src={item.book.image || "https://placehold.co/100x150"}
                            alt={item.book.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="px-2 flex items-end">
                        <span className="text-gray-500 text-sm">+{order.items.length - 3} more</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap justify-between items-center mt-4">
                    <p className="font-medium">Total: ₹{order.totalAmount}</p>
                    <p className="text-sm text-gray-500">
                      {order.items.reduce((total, item) => total + item.quantity, 0)} items
                    </p>
                  </div>
                </div>
                
                {expandedOrder === order._id && (
                  <div className="p-6 bg-gray-50">
                    <div className="mb-6">
                      <h3 className="text-lg font-medium mb-3">Order Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                          <address className="not-italic text-sm text-gray-600">
                            {order.shippingAddress.street}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                            {order.shippingAddress.country}
                          </address>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Payment Information</h4>
                          <p className="text-sm text-gray-600">
                            Payment Method: {order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery'}
                          </p>
                          <p className="text-sm text-gray-600">
                            Payment Status: {order.status === 'delivered' ? 'Paid' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-3">Order Items</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="border-b border-gray-200">
                          <tr>
                            <th className="py-2 text-left text-sm font-medium text-gray-500">Item</th>
                            <th className="py-2 text-center text-sm font-medium text-gray-500">Price</th>
                            <th className="py-2 text-center text-sm font-medium text-gray-500">Quantity</th>
                            <th className="py-2 text-right text-sm font-medium text-gray-500">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {order.items.map((item) => (
                            <tr key={item._id}>
                              <td className="py-3">
                                <div className="flex items-center">
                                  <div className="w-12 h-16 bg-gray-100 overflow-hidden rounded mr-3">
                                    <img
                                      src={item.book.image || "https://placehold.co/100x150"}
                                      alt={item.book.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">{item.book.name}</p>
                                    <p className="text-sm text-gray-500">{item.book.author}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-center">₹{item.price}</td>
                              <td className="py-3 text-center">{item.quantity}</td>
                              <td className="py-3 text-right font-medium">₹{item.price * item.quantity}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="border-t border-gray-200">
                          <tr>
                            <td colSpan="3" className="py-3 text-right font-medium">Subtotal:</td>
                            <td className="py-3 text-right">₹{order.totalAmount}</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="py-3 text-right font-medium">Shipping:</td>
                            <td className="py-3 text-right">Free</td>
                          </tr>
                          <tr>
                            <td colSpan="3" className="py-3 text-right font-medium text-lg">Total:</td>
                            <td className="py-3 text-right font-bold text-lg">₹{order.totalAmount}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
