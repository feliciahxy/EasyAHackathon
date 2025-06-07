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
    <div style={{ padding: 20, paddingTop: 96 }}>
      <h1>Decentralized Aid Disbursement MVP</h1>
      <FundWallet />
      <hr />
      <SendRLUSD wallet={wallet} /> {/* Pass wallet here */}
      <hr />
      <TrustlineCreator issuer={ISSUER_ADDRESS} />
    </div>
  );
}

export default JC;
