import axios from "axios";

const API_BASE = "http://localhost:8000";

export async function createWallet() {
  const response = await axios.post(`${API_BASE}/create_wallet`);
  return response.data;
}

export async function setupTrustline(address, issuer) {
  const response = await axios.post(`${API_BASE}/setup_trustline`, { address, issuer });
  return response.data;
}

export async function depositEscrow(sender, receiver, amount, currency = "USD") {
  const response = await axios.post(`${API_BASE}/deposit_escrow`, { sender, receiver, amount, currency });
  return response.data;
}

export async function claimFunds(escrow_sequence, claimer, did) {
  const response = await axios.post(`${API_BASE}/claim_funds`, { escrow_sequence, claimer, did });
  return response.data;
}

export const checkBalances = async (walletAddress) => {
  try {
    const response = await axios.post(`${API_BASE}/check_balances`, {
      wallet_address: walletAddress
    });
    
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.error || "Failed to fetch balances");
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.error || 
      error.message || 
      "An error occurred while fetching balances"
    );
  }
};

export const createTrustlineApi = (address, secret, issuer) => {
  return axios.post(`${BASE_URL}/create_trustline`, {
    address,
    secret,
    issuer,
  });
};

export async function sendRLUSD(sender, secret, recipient, amount) {
  const ISSUER = "rEBQEFvhgZKEbUMSFcwe5SM7FyEDN26zRL";
  const CURRENCY = "USD";

  try {
    const response = await axios.post(`${API_BASE}/send_rlusd`, {
      sender,
      secret,
      recipient,
      amount,
      currency: CURRENCY,
      issuer: ISSUER,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
      error.message ||
      "Failed to send RLUSD"
    );
  }
}

