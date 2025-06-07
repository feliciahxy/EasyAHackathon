const express = require('express');
const router = express.Router();
const { createEscrow } = require('../controllers/escrowController');

router.post('/create-escrow', createEscrow);

module.exports = router;
