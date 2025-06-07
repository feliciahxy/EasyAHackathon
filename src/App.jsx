import React from 'react';
import CreateWallet from './CreateWallet';
import CheckBalance from './CheckBalance';
import Escrow from './Escrow';
import SetupTrustline from './SetupTrustline';

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>XRPL Web App</h1>

      <CreateWallet />
      <hr />

      <CheckBalance />
      <hr />

      <Escrow />
      <hr />

      <SetupTrustline />
    </div>
  );
}

export default App;
