require('dotenv').config();
const xrpl = require('xrpl');

const client = new xrpl.Client(process.env.XRPL_SERVER);

// Lazy connect
async function connectClient() {
  if (!client.isConnected()) {
    await client.connect();
  }
}

// ✅ runtime-safe wallet loader
function getWallet() {
  const seed = process.env.XRPL_SEED;
  if (!seed || typeof seed !== 'string') {
    throw new Error("XRPL_SEED is missing or invalid in .env");
  }
  return xrpl.Wallet.fromSeed(seed);
}

async function getBalance() {
  await connectClient();
  const wallet = getWallet();
  const response = await client.request({
    command: 'account_info',
    account: wallet.address,
    ledger_index: 'validated'
  });
  const balanceDrops = response.result.account_data.Balance;
  return parseFloat(balanceDrops) / 1_000_000;
}

async function sendXRP(destination, amountXRP) {
  await connectClient();
  const wallet = getWallet();
  const tx = {
    TransactionType: 'Payment',
    Account: wallet.address,
    Amount: xrpl.xrpToDrops(amountXRP),
    Destination: destination,
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  return result.result;
}

// Optional: export getWallet if needed elsewhere
module.exports = { getBalance, sendXRP, getWallet };
