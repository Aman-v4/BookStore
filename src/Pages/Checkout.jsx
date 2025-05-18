import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Form state
  const [shippingDetails, setShippingDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'India'
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (cart.items.length === 0 && !orderPlaced) {
      navigate('/Cart');
    }

    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/Login');
    }
  }, [cart.items.length, user, navigate, orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setShippingDetails({
        ...shippingDetails,
        [parent]: {
          ...shippingDetails[parent],
          [child]: value
        }
      });
    } else {
      setShippingDetails({
        ...shippingDetails,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create order
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: cart.items.map(item => ({
            book: item.book._id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: cart.totalAmount,
          shippingAddress: {
            street: shippingDetails.street,
            city: shippingDetails.city,
            state: shippingDetails.state,
            zipCode: shippingDetails.zipCode,
            country: shippingDetails.country
          },
          paymentMethod
        })
      });

      const orderData = await response.json();
      
      if (!response.ok) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Clear cart and show success animation
      await clearCart();
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
      
      // Redirect to Orders page after a short delay
      setTimeout(() => {
        navigate('/Orders');
      }, 3000);
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Processing your order...</p>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-green-500" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Thank You!</h2>
          <p className="text-xl mb-6 text-gray-600">Your order has been placed successfully.</p>
          <p className="mb-6 text-gray-500">
            You will be redirected to your orders page in a moment...
          </p>
          <div className="loader w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="loading-bar h-full bg-indigo-600 rounded-full animate-loading-bar"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={shippingDetails.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingDetails.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingDetails.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1 text-sm font-medium">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={shippingDetails.street}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingDetails.city}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">State/Province</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingDetails.state}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">ZIP/Postal Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingDetails.zipCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={shippingDetails.country}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={paymentMethod === 'cash_on_delivery'}
                        onChange={() => setPaymentMethod('cash_on_delivery')}
                        className="mr-2"
                      />
                      Cash on Delivery
                    </label>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  disabled={loading}
                >
                  Place Order
                </button>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="max-h-60 overflow-y-auto mb-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex py-2 border-b border-gray-200 last:border-0">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.book.image || "https://placehold.co/100x150"}
                        alt={item.book.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h4 className="text-sm font-medium">{item.book.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{cart.totalAmount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{cart.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add loading animation styles to your CSS
const styleTag = document.createElement('style');
styleTag.innerHTML = `
@keyframes loading {
  0% { width: 0% }
  100% { width: 100% }
}
.animate-loading-bar {
  animation: loading 3s linear forwards;
}
`;
document.head.appendChild(styleTag);

export default Checkout; 