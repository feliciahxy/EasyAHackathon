import React, { useState } from 'react';

function CheckBalance() {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckBalance = async () => {
    if (!address) {
      setError('Please enter a wallet address.');
      return;
    }

    setError('');
    setLoading(true);
    setBalance(null);

    try {
      const res = await fetch('http://localhost:3001/api/check-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      const data = await res.json();

      if (res.ok) {
        setBalance(data.balance);
      } else {
        setError(data.error || 'Failed to check balance');
      }
    } catch (err) {
      setError('Network or server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-screen">
      <div className="card w-96 bg-base-100 card-xl shadow-lg">
        <div className="card-body">
          <h2 className="card-title">Check XRPL Wallet Balance</h2>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          <button onClick={handleCheckBalance} disabled={loading}>
            {loading ? 'Checking...' : 'Check Balance'}
          </button>

          {balance !== null && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Balance:</strong> {balance} XRP
            </div>
          )}

          {error && (
            <div style={{ marginTop: '1rem', color: 'red' }}>
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckBalance;
