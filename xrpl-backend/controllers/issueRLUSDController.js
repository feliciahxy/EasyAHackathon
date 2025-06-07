const xrpl = require("xrpl");

async function issueRLUSD(req, res) {
  const { destination, amount } = req.body;
  const issuerSeed = process.env.RLUSD_ISSUER_SEED;

  if (!destination || !amount) {
    return res.status(400).json({ error: "Missing destination or amount" });
  }

  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  try {
    const issuerWallet = xrpl.Wallet.fromSeed(issuerSeed);

    const tx = {
      TransactionType: "Payment",
      Account: issuerWallet.address,
      Destination: destination,
      Amount: {
        currency: "RLUSD",
        issuer: issuerWallet.address,
        value: amount.toString()
      }
    };

    const prepared = await client.autofill(tx);
    const signed = issuerWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);
    res.json({ result });
  } catch (err) {
    console.error("Issue RLUSD error:", err);
    res.status(500).json({ error: "Failed to issue RLUSD" });
  } finally {
    client.disconnect();
  }
}

module.exports = { issueRLUSD };
