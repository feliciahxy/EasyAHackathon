const xrpl = require('xrpl');
require('dotenv').config();

async function setTrustline(req, res) {
  const { receiverSeed, limit } = req.body;
  const issuer = process.env.RLUSD_ISSUER_ADDRESS;

  if (!receiverSeed || !limit) {
    return res.status(400).json({ error: "receiverSeed and limit are required" });
  }

  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");

  try {
    await client.connect();

    const receiverWallet = xrpl.Wallet.fromSeed(receiverSeed);

    const tx = {
      TransactionType: "TrustSet",
      Account: receiverWallet.address,
      LimitAmount: {
        currency: "RLUSD",
        issuer: issuer,
        value: limit.toString(),
      }
    };

    const prepared = await client.autofill(tx);
    const signed = receiverWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    await client.disconnect();

    res.json({ result });
  } catch (err) {
    console.error("Trustline setup error:", err);
    res.status(500).json({ error: "Failed to set trustline" });
  }
}

module.exports = { setTrustline };
