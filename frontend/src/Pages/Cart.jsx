import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RQMfLFZKBm2CmJI9Wn9wZSsZurJxaq6uxZfDvBBUXgTqxPFoiv6rVgrXKALh1y3UMvEDGP8QnZEqiqHORyvEN2J00DyTz2t8P');

const Cart = () => {
  const { cart, loading, removeFromCart, updateCartItem, clearCart } = useCart();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6">
        <h2 className="text-2xl font-semibold mb-6">Please login to view your cart</h2>
        <Link to="/Login" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Go to Login
        </Link>
      </div>
    );
  }

  const handleRemoveItem = async (itemId) => {
    setIsUpdating(true);
    const result = await removeFromCart(itemId);
    setIsUpdating(false);
    
    if (result.success) {
      toast.success('Item removed from cart');
    } else {
      toast.error(result.error || 'Failed to remove item from cart');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    const result = await updateCartItem(itemId, newQuantity);
    setIsUpdating(false);
    
    if (result.success) {
      toast.success('Cart updated');
    } else {
      toast.error(result.error || 'Failed to update cart');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setIsUpdating(true);
      const result = await clearCart();
      setIsUpdating(false);
      
      if (result.success) {
        toast.success('Cart cleared');
      } else {
        toast.error(result.error || 'Failed to clear cart');
      }
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      setProcessingPayment(true);
      
      // Create a Stripe checkout session
      const stripe = await stripePromise;
      
      // Call your backend to create a checkout session
      const response = await fetch('http://localhost:5000/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          cartItems: cart.items,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Handle minimum amount error specially
        if (data.minAmount) {
          throw new Error(`Your order total must be at least ₹${data.minAmount} to checkout with Stripe. Please add more items to your cart.`);
        }
        throw new Error(data.message || 'Could not create checkout session');
      }
      
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: data.id,
      });
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Something went wrong with the checkout process');
      setProcessingPayment(false);
    }
  };

  if (loading || isUpdating || processingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">
          {processingPayment ? 'Preparing checkout...' : 'Loading...'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cart.items.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg mb-4">Your cart is empty.</p>
            <Link to="/Explore" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-4 px-6 text-left">Product</th>
                    <th className="py-4 px-6 text-center">Price</th>
                    <th className="py-4 px-6 text-center">Quantity</th>
                    <th className="py-4 px-6 text-center">Total</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item._id} className="border-t border-gray-200">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <img 
                            src={item.book.image || "https://placehold.co/100x150"}
                            alt={item.book.name}
                            className="w-16 h-20 object-cover mr-4"
                          />
                          <div>
                            <h3 className="font-medium">{item.book.name}</h3>
                            <p className="text-gray-600 text-sm">{item.book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">₹{item.price}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-medium">₹{item.price * item.quantity}</td>
                      <td className="py-4 px-6 text-center">
                        <button 
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex space-x-4">
                <Link 
                  to="/Explore" 
                  className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={handleClearCart}
                  className="px-6 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
                >
                  Clear Cart
                </button>
              </div>
              
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{cart.totalAmount}</span>
                </div>
                <div className="flex justify-between mb-4">
                  <span>Shipping:</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{cart.totalAmount}</span>
                </div>
                {cart.totalAmount < 50 && (
                  <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 text-sm rounded">
                    Note: Minimum checkout amount with Stripe is ₹50. Please add more items to proceed.
                  </div>
                )}
                <button 
                  onClick={handleCheckout}
                  className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center justify-center"
                  disabled={processingPayment || cart.totalAmount < 50}
                >
                  <span>Proceed to Payment</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
