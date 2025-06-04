import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        if (!sessionId) {
          // No session ID provided, navigate back to cart
          navigate('/Cart');
          return;
        }

        // Create order directly in case webhook didn't work
        if (!orderCreated && user && cart.items.length > 0) {
          try {
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
                shippingAddress: user.address || {
                  street: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  country: 'India'
                },
                paymentMethod: 'stripe'
              })
            });

            if (response.ok) {
              setOrderCreated(true);
              await clearCart();
              toast.success('Order placed successfully!');
            } else {
              const error = await response.json();
              console.error('Failed to create order:', error);
              // Don't show error to user, as order might have been created by webhook
            }
          } catch (error) {
            console.error('Error creating order:', error);
            // Continue anyway as the webhook might have created the order
          }
        } else {
          // If no items in cart, assume order was already created by webhook
          await clearCart();
        }
        
        // Allow the success animation to show for a few seconds before redirecting
        setTimeout(() => {
          setIsLoading(false);
          // Navigate to orders page after 3 seconds
          setTimeout(() => {
            navigate('/Orders');
          }, 3000);
        }, 2000);
        
      } catch (error) {
        console.error('Error verifying payment:', error);
        navigate('/Cart');
      }
    };

    verifyPayment();
  }, [sessionId, clearCart, navigate, user, cart.items, orderCreated]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-lg mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your payment was successful and your order has been placed.
          </p>
          <div className="animate-loading-bar h-2 bg-indigo-600 rounded-full"></div>
          <p className="mt-4 text-gray-600">Redirecting to your orders...</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess; 