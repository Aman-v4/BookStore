const express = require('express');
const router = express.Router();
const UserData = require('../models/UserData');  

router.get('/userdata', async (req, res) => {
  try {
    const userId = req.user.id; 
    const userData = await UserData.findOne({ userId });

    if (!userData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(userData);  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

module.exports = router;
