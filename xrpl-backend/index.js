require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getBalance, sendXRP, wallet } = require('./xrplService');
const cors = require('cors');
app.use(cors());

const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(process.env.PORT, () => {
  console.log(`XRPL Backend running on port ${process.env.PORT}`);
});
