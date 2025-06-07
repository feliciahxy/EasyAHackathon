const xrpl = require('xrpl');

async function createWallet() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233"); // Use testnet
  await client.connect();

  const fundResult = await client.fundWallet(); // Use XRPL Testnet Faucet

  const wallet = fundResult.wallet;
  console.log("✅ New wallet created:");
  console.log("Address:", wallet.address);
  console.log("Seed:", wallet.seed);
  console.log("Balance:", fundResult.balance);

  await client.disconnect();
}

createWallet();
