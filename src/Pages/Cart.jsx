import React from 'react';
import { useCart } from '../Context/CartContext';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

// Group items by ID and count quantity
const groupCartItems = (items) => {
  const grouped = {};

  items.forEach((item) => {
    if (grouped[item.id]) {
      grouped[item.id].quantity += 1;
    } else {
      grouped[item.id] = { ...item, quantity: 1 };
    }
  });

  return Object.values(grouped);
};

const Cart = () => {
  const { cartItems, removeFromCart } = useCart();
  const groupedItems = groupCartItems(cartItems);

  const subtotal = groupedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = +(subtotal * 0.05).toFixed(2);
  const deliveryCharge = 30;
  const total = subtotal + tax + deliveryCharge;

  return (
    <>
      <Navbar />
      <div className="min-h-screen px-6 md:px-16 lg:px-32 py-12 bg-gray-100">
        <h1 className="text-3xl font-bold mb-10 text-center">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Your cart is empty.</p>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            {/* Header */}
            <div className="grid grid-cols-12 border-b pb-2 text-gray-500 text-sm font-medium">
              <div className="col-span-5">Item</div>
              <div className="col-span-2 text-center">Author</div>
              <div className="col-span-1 text-center">Qty</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Action</div>
            </div>

            {/* Cart Rows */}
            {groupedItems.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 items-center border-b py-4 text-sm"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-20 object-cover "
                  />
                  <span className="font-medium">{item.name}</span>
                </div>

                <div className="col-span-2 text-center text-gray-600">
                  {item.author}
                </div>

                <div className="col-span-1 text-center font-medium">
                  {item.quantity}
                </div>

                <div className="col-span-2 text-center font-semibold text-green-700">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </div>

                <div className="col-span-2 text-center">
                  <button
                    onClick={() => removeFromCart(item.id)} 
                    className="text-red-500 text-xs bg-red-100 px-3 py-1 hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {/* Price Summary */}
            <div className="text-sm text-gray-700 mt-6 space-y-2 max-w-md ml-auto">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>₹{deliveryCharge}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <button className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
