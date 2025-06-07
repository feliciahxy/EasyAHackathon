import React, { useState } from 'react';

function CreateWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/wallet', {
        method: 'POST',
      });
      const data = await res.json();
      setWallet(data);
    } catch (error) {
      console.error('Error creating wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px' }}>
      <h2>Create XRPL Wallet</h2>
      <button onClick={handleCreateWallet} disabled={loading}>
        {loading ? 'Creating Wallet...' : 'Create Wallet'}
      </button>

      {wallet && (
        <div style={{ marginTop: '1.5rem' }}>
          <p><strong>Wallet Address:</strong></p>
          <code>{wallet.address}</code>

          <p><strong>Wallet Secret (Seed):</strong></p>
          <code>{wallet.seed}</code>

          <p><strong>Funded Balance:</strong> {wallet.balance} XRP</p>

          <div style={{ marginTop: '0.5rem', color: 'red' }}>
            ⚠️ Do not share your wallet seed with anyone.
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateWallet;
