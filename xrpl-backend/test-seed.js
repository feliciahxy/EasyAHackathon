require('dotenv').config();
const xrpl = require('xrpl');

console.log("Loaded seed:", process.env.XRPL_SENDER_SEED);

try {
  const wallet = xrpl.Wallet.fromSeed(process.env.XRPL_SENDER_SEED);
  console.log("✅ Wallet loaded!");
  console.log("Address:", wallet.address);
} catch (err) {
  console.error("❌ Error loading wallet:", err);
}