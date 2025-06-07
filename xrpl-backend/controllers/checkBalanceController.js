const xrpl = require("xrpl");

async function checkBalance(req, res) {
  const { address, issuer } = req.query;

  if (!address || !issuer) {
    return res.status(400).json({ error: "Missing address or issuer" });
  }

  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  try {
    const response = await client.request({
      command: "account_lines",
      account: address
    });

    const balanceLine = response.result.lines.find(
      (line) => line.currency === "RLUSD" && line.account === issuer
    );

    res.json({ balance: balanceLine ? balanceLine.balance : "0.0" });
  } catch (err) {
    console.error("Balance check error:", err);
    res.status(500).json({ error: "Failed to check RLUSD balance" });
  } finally {
    client.disconnect();
  }
}

module.exports = { checkBalance };
