const xrpl = require("xrpl");
require("dotenv").config();

async function createEscrow(req, res) {
  const { destination, amount } = req.body;

  if (!destination || !amount) {
    return res.status(400).json({ error: "Destination and amount are required." });
  }

  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");

  try {
    await client.connect();

    const senderWallet = xrpl.Wallet.fromSeed(process.env.XRPL_SENDER_SEED);
    const rlusdIssuer = process.env.RLUSD_ISSUER_ADDRESS;

    const tx = {
      TransactionType: "Payment",
      Account: senderWallet.address,
      Destination: destination,
      Amount: {
        currency: "RLUSD",
        issuer: rlusdIssuer,
        value: amount.toString(),
      },
      Memos: [
        {
          Memo: {
            MemoType: xrpl.convertStringToHex("Escrow"),
            MemoData: xrpl.convertStringToHex(`Escrowed RLUSD to ${destination}`)
          }
        }
      ]
    };

    const prepared = await client.autofill(tx);
    const signed = senderWallet.sign(prepared);
    const result = await client.submitAndWait(signed.tx_blob);

    await client.disconnect();
    res.json({ result });
  } catch (err) {
    console.error("Escrow error:", err);
    res.status(500).json({ error: "Failed to send RLUSD into escrow" });
  }
}

module.exports = { createEscrow };
