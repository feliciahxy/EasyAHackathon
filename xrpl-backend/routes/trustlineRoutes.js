const express = require('express');
const router = express.Router();

const { setTrustline } = require('../controllers/trustlineController');

router.post('/set-trustline', setTrustline);

module.exports = router;
