const xrpl = require('xrpl');

async function createWallet(req, res) {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");

  try {
    await client.connect();

    const result = await client.fundWallet(); // Testnet faucet
    const wallet = result.wallet;

    await client.disconnect();

    res.json({
      address: wallet.address,
      seed: wallet.seed,
      balance: result.balance,
    });
  } catch (err) {
    console.error("❌ Failed to create wallet:", err);
    res.status(500).json({ error: "Failed to create wallet" });
  }
}

async function checkBalance(req, res) {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");

  try {
    await client.connect();

    const response = await client.request({
      command: 'account_info',
      account: address,
      ledger_index: 'validated'
    });

    const balanceDrops = response.result.account_data.Balance;
    const balanceXRP = parseFloat(balanceDrops) / 1_000_000;

    await client.disconnect();

    res.json({ balance: balanceXRP });
  } catch (err) {
    console.error('❌ Failed to check balance:', err);
    res.status(500).json({ error: 'Failed to check balance. Make sure the address is valid and activated.' });
  }
}

module.exports = {
  createWallet,
  checkBalance
};


