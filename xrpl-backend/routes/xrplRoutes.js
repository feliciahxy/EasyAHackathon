const express = require('express');
const router = express.Router();

const {
  createWallet,
  checkBalance
} = require('../controllers/xrplController');

router.post('/wallet', createWallet);
router.post('/check-balance', checkBalance);

module.exports = router;
