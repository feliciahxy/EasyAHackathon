import React, { useState } from 'react';

function SetupTrustline() {
  const [seed, setSeed] = useState('');
  const [limit, setLimit] = useState('');

  const handleSetup = async () => {
    const res = await fetch("http://localhost:3001/api/trustline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seed,
        currency: "RLUSD",
        issuer: "rYOUR_ISSUER_ADDRESS_HERE", // must match backend .env
        limit
      })
    });
    const data = await res.json();
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div>
      <h3>Setup Trustline</h3>
      <input placeholder="Receiver Seed" value={seed} onChange={(e) => setSeed(e.target.value)} />
      <input placeholder="Limit" value={limit} onChange={(e) => setLimit(e.target.value)} />
      <button onClick={handleSetup}>Set Trustline</button>
    </div>
  );
}

export default SetupTrustline;
