const xrpl = require("xrpl");
require("dotenv").config();

async function createEscrow(req, res) {
  const { destination, amount } = req.body;

  // Validate inputs
  if (!destination || !amount) {
    return res.status(400).json({ error: "Destination and amount are required." });
  }

  if (!xrpl.isValidAddress(destination)) {
    return res.status(400).json({ error: "Invalid XRPL destination address." });
  }

  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");

  try {
    await client.connect();

    const senderWallet = xrpl.Wallet.fromSeed(process.env.XRPL_SENDER_SEED.trim());
    const rlusdIssuer = process.env.RLUSD_ISSUER_ADDRESS.trim();

    const tx = {
      TransactionType: "Payment",
      Account: senderWallet.address,
      Destination: destination,
      Amount: {
        currency: "524C555344000000000000000000000000000000", // HEX for "RLUSD"
        issuer: rlusdIssuer,
        value: amount.toString().trim(),
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
