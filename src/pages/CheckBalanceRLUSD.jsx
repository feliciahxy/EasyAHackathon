import React, { useState } from 'react';

function CheckBalanceRLUSD() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);

  const check = async () => {
    const issuer = "rYOUR_ISSUER_ADDRESS_HERE"; // must match
    const res = await fetch(`http://localhost:3001/api/check-rlusd-balance?address=${address}&issuer=${issuer}`);
    const data = await res.json();
    setBalance(data.balance);
  };

  return (
    <div>
      <h3>Check RLUSD Balance</h3>
      <input placeholder="Wallet Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <button onClick={check}>Check</button>
      <p>Balance: {balance ?? "N/A"}</p>
    </div>
  );
}

export default CheckBalanceRLUSD;
