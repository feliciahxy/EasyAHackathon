require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getBalance, sendXRP, wallet } = require('../services/xrplService');
const app = express();
app.use(cors({
  origin: frontendUrl
}));
app.use(express.json());

const frontendUrl = process.env.VITE_FRONTEND_URL || 'http://localhost:5173';



// Mount routes from /routes folder
const xrplRoutes = require('../routes/xrplRoutes');
app.use('/api', xrplRoutes);

const escrowRoutes = require('../routes/escrowRoutes');
app.use('/api/escrow', escrowRoutes);

// (optional) Keep balance/send here if not modularized
app.get('/api/balance', async (req, res) => {
  try {
    const balance = await getBalance();
    res.json({ address: wallet.address, balance });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting balance");
  }
});

app.post('/api/send', async (req, res) => {
  const { destination, amount } = req.body;
  try {
    const result = await sendXRP(destination, amount);
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending XRP");
  }
});

export default app;

// app.listen(process.env.PORT, () => {
//   console.log(`🚀 XRPL Backend running on port ${process.env.PORT}`);
// });

