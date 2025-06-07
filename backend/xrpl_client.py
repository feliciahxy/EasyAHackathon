import time
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountInfo
from xrpl.wallet import Wallet, generate_faucet_wallet
from xrpl.models.transactions import Payment, TrustSet, EscrowCreate, EscrowFinish
from xrpl.models.amounts import IssuedCurrencyAmount
from xrpl.transaction import submit_and_wait
from xrpl.utils import xrp_to_drops

# XRPL Testnet client
CLIENT = JsonRpcClient("https://s.altnet.rippletest.net:51234")

# ✅ Create & optionally fund a new wallet
def create_wallet():
    for attempt in range(3):
        try:
            print(f"Attempt {attempt + 1} to create and fund wallet via faucet...")
            wallet = generate_faucet_wallet(CLIENT, debug=True)
            print("✅ Wallet created and funded:", wallet.classic_address)
            return wallet
        except Exception as e:
            print(f"❌ Faucet error (attempt {attempt + 1}): {e}")
            time.sleep(3)  # Wait before retry

    print("⚠️ Faucet failed. Creating unfunded wallet (for manual funding).")
    wallet = Wallet.create()
    print("⚠️ Unfunded wallet address:", wallet.classic_address)
    return wallet

# ✅ Establish a trust line for USD or any token
def setup_trustline(wallet: Wallet, issuer_address: str, currency="USD", limit="1000"):
    trust_tx = TrustSet(
        account=wallet.classic_address,
        limit_amount=IssuedCurrencyAmount(
            currency=currency,
            issuer=issuer_address,
            value=limit
        )
    )
    return submit_and_wait(trust_tx, CLIENT, wallet)

# ✅ Send a USD payment from one wallet to another
def send_usd_payment(sender_wallet: Wallet, dest_address: str, issuer_address: str, amount: str):
    payment = Payment(
        account=sender_wallet.classic_address,
        destination=dest_address,
        amount=IssuedCurrencyAmount(
            currency="USD",
            issuer=issuer_address,
            value=amount
        )
    )
    return submit_and_wait(payment, CLIENT, sender_wallet)

# ✅ Create an escrow (XRP only - XRPL doesn't support token escrows directly)
def create_escrow(sender_wallet: Wallet, dest_address: str, amount: str, currency="XRP", finish_after_seconds=60):
    finish_after = int(time.time()) + finish_after_seconds
    
    # IMPORTANT: XRPL EscrowCreate only supports XRP, not issued currencies
    if currency != "XRP":
        raise ValueError("XRPL EscrowCreate only supports XRP. Use Payment for issued currencies.")
    
    # Convert XRP amount to drops
    if isinstance(amount, str):
        amount_xrp = float(amount)
    else:
        amount_xrp = float(amount)
    
    amount_drops = xrp_to_drops(amount_xrp)
    
    escrow_tx = EscrowCreate(
        account=sender_wallet.classic_address,
        destination=dest_address,
        amount=str(amount_drops),  # Must be string in drops
        finish_after=finish_after,
    )
    
    return submit_and_wait(escrow_tx, CLIENT, sender_wallet)

# ✅ Release escrowed funds after time lock expires
def finish_escrow(wallet: Wallet, owner: str, escrow_sequence: int):
    escrow_finish = EscrowFinish(
        account=wallet.classic_address,
        owner=owner,
        offer_sequence=escrow_sequence  # Note: it's offer_sequence, not escrow_sequence
    )
    return submit_and_wait(escrow_finish, CLIENT, wallet)

# ✅ Simulated DID check (replace with real flow if needed)
def verify_did(did: str):
    # Example: DID = "did:example:0x123..."
    print(f"Simulated DID verification for {did}")
    return len(did) > 10  # Simple validation for demo

# ✅ Alternative: Direct payment for "escrow-like" behavior with issued currencies
def send_conditional_payment(sender_wallet: Wallet, dest_address: str, issuer_address: str, amount: str, currency="USD"):
    """
    Alternative to escrow for issued currencies - direct payment
    In a real app, you'd implement conditional logic on your backend
    """
    payment = Payment(
        account=sender_wallet.classic_address,
        destination=dest_address,
        amount=IssuedCurrencyAmount(
            currency=currency,
            issuer=issuer_address,
            value=amount
        )
    )
    return submit_and_wait(payment, CLIENT, sender_wallet)