import React, { useState } from 'react';

function IssueRLUSD() {
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');

  const handleIssue = async () => {
    const res = await fetch("http://localhost:3001/api/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, amount })
    });
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <h3>Issue RLUSD</h3>
      <input placeholder="Destination Address" value={destination} onChange={(e) => setDestination(e.target.value)} />
      <input placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handleIssue}>Send RLUSD</button>
    </div>
  );
}

export default IssueRLUSD;
