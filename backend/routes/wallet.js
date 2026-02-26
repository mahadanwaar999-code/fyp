const express = require('express');
const router = express.Router();
const Wallet = require('../models/Wallet');
const BankAccount = require('../models/BankAccount');
const KYC = require('../models/KYC');
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const authenticate = require('../middleware/auth');

// Get Wallet Balance
router.get('/balance', authenticate, async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      wallet = new Wallet({ 
        userId: req.user.id, 
        userModel: req.user.role === 'student' ? 'Student' : 'Teacher',
        balance: req.user.role === 'student' ? 1000 : 0 // Give students 1000 PKR for testing
      });
      await wallet.save();
    }
    res.json(wallet);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Add Bank Account
router.post('/bank-account', authenticate, async (req, res) => {
  try {
    const { bankName, accountNumber, accountTitle } = req.body;
    const bankAccount = new BankAccount({
      userId: req.user.id,
      userModel: req.user.role === 'student' ? 'Student' : 'Teacher',
      bankName,
      accountNumber,
      accountTitle
    });
    await bankAccount.save();
    res.json({ message: 'Bank account added successfully', bankAccount });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Upload KYC (Mock)
router.post('/kyc', authenticate, async (req, res) => {
  try {
    const { documentType, documentUrl } = req.body;
    const kyc = await KYC.findOneAndUpdate(
      { userId: req.user.id },
      { documentType, documentUrl, status: 'pending', submittedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json({ message: 'KYC submitted successfully', kyc });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
