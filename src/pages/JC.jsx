import React, { useState } from "react";
import WalletCreator from "../components/WalletCreator";
import FundWallet from "../components/FundWallet";
import BalanceChecker from "../components/BalanceChecker";
import TrustlineCreator from "../components/TrustlineCreator";
import SendRLUSD from "../components/SendRLUSD";

const ISSUER_ADDRESS = "rEBQEFvhgZKEbUMSFcwe5SM7FyEDN26zRL";

const JC = () => {
  const [wallet, setWallet] = useState(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>Decentralized Aid Disbursement MVP</h1>
      <WalletCreator onWalletCreated={setWallet} />
      <hr />
      <FundWallet />
      <hr />
      <SendRLUSD wallet={wallet} /> {/* Pass wallet here */}
      <hr />
      <header className="app-header">
        <h1>XRPL Wallet Balances</h1>
      </header>
      <main className="app-content">
        <BalanceChecker />
      </main>
      <hr />
      <TrustlineCreator issuer={ISSUER_ADDRESS} />
    </div>
  );
}

export default JC;
