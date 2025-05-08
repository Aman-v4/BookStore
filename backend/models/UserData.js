const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  cart: [
    {
      bookId: String,
      quantity: Number,
    }
  ],
  wishlist: [String],
  orderHistory: [
    {
      items: [
        {
          bookId: String,
          quantity: Number,
        }
      ],
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('UserData', userDataSchema);
