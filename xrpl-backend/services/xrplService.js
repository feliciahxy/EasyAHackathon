require('dotenv').config();
const xrpl = require('xrpl');

const client = new xrpl.Client(process.env.XRPL_SERVER);
const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_SEED);

async function connectClient() {
  if (!client.isConnected()) {
    await client.connect();
  }
}

async function getBalance() {
  await connectClient();
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

module.exports = { getBalance, sendXRP, wallet };
