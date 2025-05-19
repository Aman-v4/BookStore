import mongoose from 'mongoose';

// Cart item schema (embedded)
const cartItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: true, timestamps: true });

// Order item schema (embedded)
const orderItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
}, { _id: true });

// Order schema (embedded)
const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery', 'stripe'],
    default: 'cash_on_delivery'
  },
  orderNumber: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

// Main user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  phone: {
    type: String,
    trim: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  cart: {
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0
    }
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }],
  orders: [orderSchema],
  registeredAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate cart total before saving
userSchema.pre('save', function(next) {
  if (this.isModified('cart.items')) {
    let total = 0;
    this.cart.items.forEach(item => {
      total += item.price * item.quantity;
    });
    this.cart.totalAmount = total;
  }
  next();
});

// Generate order number before saving a new order
userSchema.methods.generateOrderNumber = function() {
  const timestamp = Date.now().toString();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp.substring(timestamp.length - 6)}-${randomStr}`;
};

const User = mongoose.model('User', userSchema);

export default User; 