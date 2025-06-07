import React, { useEffect, useState } from 'react';

function App() {
  const [balance, setBalance] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const res = await fetch('http://localhost:3001/api/balance');
        const data = await res.json();
        setWalletAddress(data.address);
        setBalance(data.balance);
      } catch (e) {
        console.error("Error fetching balance:", e);
      }
    }

    fetchBalance();
  }, []);

  return (
    <div>
      <h1>XRPL Wallet Balance</h1>
      <p>Address: {walletAddress ?? "Loading..."}</p>
      <p>Balance: {balance !== null ? `${balance} XRP` : "Loading..."}</p>
    </div>
  );
}

export default App;
