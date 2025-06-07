import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/transfer_rlusd";

function TransferRLUSD() {
  const [senderSeed, setSenderSeed] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  const handleTransfer = async () => {
    if (!senderSeed || !receiverAddress || !amount) {
      setStatus("❌ All fields are required.");
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        sender_seed: senderSeed,
        receiver_address: receiverAddress,
        amount,
      });

      if (response.data.success) {
        setStatus(`✅ Success! TX Hash: ${response.data.result.hash}`);
      } else {
        setStatus(`❌ Failed: ${response.data.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error: Transaction failed.");
    }
  };

  return (
    <div>
      <h2>Transfer RLUSD</h2>
      <div>
        <label>Sender Secret:</label>
        <input
          type="text"
          value={senderSeed}
          onChange={(e) => setSenderSeed(e.target.value)}
          placeholder="sEd..."
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <label>Receiver Address:</label>
        <input
          type="text"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          placeholder="r..."
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <label>Amount (RLUSD):</label>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 25"
        />
      </div>
      <button onClick={handleTransfer}>Send RLUSD</button>
      <p>{status}</p>
    </div>
  );
}

export default TransferRLUSD;
