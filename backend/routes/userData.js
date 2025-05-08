const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');
const checkJwt = require('../auth');

router.get('/:userId', checkJwt, async (req, res) => {
  try {
    const { userId } = req.params;
    let user = await UserData.findOne({ userId });

    if (!user) {
      user = new UserData({ userId, cart: [], wishlist: [], orderHistory: [] });
      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user data:', err);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

// Update cart
router.post('/cart', checkJwt, async (req, res) => {
  const { cartItems } = req.body;
  const userId = req.user.userId;

  try {
    let user = await UserData.findOne({ userId });

    if (!user) {
      user = new UserData({ userId, cart: [], wishlist: [], orderHistory: [] });
    }

    user.cart = cartItems;
    await user.save();

    res.status(200).json({ message: 'Cart updated successfully' });
  } catch (err) {
    console.error('Error saving cart:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Update wishlist
router.post('/wishlist', checkJwt, async (req, res) => {
  const { wishlistItems } = req.body;
  const userId = req.user.userId;

  try {
    let user = await UserData.findOne({ userId });

    if (!user) {
      user = new UserData({ userId, cart: [], wishlist: [], orderHistory: [] });
    }

    user.wishlist = wishlistItems;
    await user.save();

    res.status(200).json({ message: 'Wishlist updated successfully' });
  } catch (err) {
    console.error('Error saving wishlist:', err);
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

router.post('/add-order', checkJwt, async (req, res) => {
  const { items, total } = req.body;
  const userId = req.user.userId;

  try {
    let user = await UserData.findOne({ userId });

    if (!user) {
      user = new UserData({ userId, cart: [], wishlist: [], orderHistory: [] });
    }

    user.orderHistory.push({ items, total, date: new Date() });
    user.cart = []; 
    await user.save();

    res.status(200).json({ message: 'Order added successfully' });
  } catch (err) {
    console.error('❌ Error saving order:', err);
    res.status(500).json({ error: 'Failed to add order' });
  }
});

module.exports = router;
