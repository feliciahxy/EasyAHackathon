import React, { useState } from "react";

function SetupTrustline() {
  const [seed, setSeed] = useState("");
  const [limit, setLimit] = useState("1000");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    try {
      const res = await fetch("http://localhost:3001/api/trustline/set-trustline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverSeed: seed, limit }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to set trustline");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Setup RLUSD Trustline</h2>
      <input
        placeholder="Receiver Wallet Seed"
        value={seed}
        onChange={(e) => setSeed(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <input
        placeholder="Limit (e.g. 1000)"
        value={limit}
        onChange={(e) => setLimit(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <button onClick={handleSubmit}>Set Trustline</button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default SetupTrustline;
