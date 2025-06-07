import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

async function sendRLUSD(recipient, amount) {
  try {
    const response = await axios.post(`${API_BASE}/send_rlusd`, {
      destination: recipient,
      amount,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || error.message || "Failed to send RLUSD"
    );
  }
}

export default function SendRLUSD() {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      setStatus("Sending RLUSD...");
  
      try {
        const result = await sendRLUSD(recipient, amount);
        setStatus(`Success! Transaction hash: ${result.tx_hash || "N/A"}`);
      } catch (error) {
        setStatus(`Error: ${error.message}`);
      }
    };
  
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Recipient Address:
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              required
              placeholder="r..."
            />
          </label>
          <br />
          <label>
            Amount (RLUSD):
            <input
              type="number"
              min="0"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Send</button>
        </form>
        {status && <p>{status}</p>}
      </div>
    );
  }
  