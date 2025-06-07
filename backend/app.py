from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from xrpl_client import (
    create_wallet,
    setup_trustline,
    send_usd_payment,
    create_escrow,
    finish_escrow,
    verify_did
)
from xrpl.wallet import Wallet
from xrpl.clients import JsonRpcClient
from xrpl.models.requests import AccountInfo
from xrpl.models.transactions import Payment, TrustSet
from xrpl.transaction import submit_and_wait
from xrpl.models.amounts import IssuedCurrencyAmount
from xrpl.models.requests import AccountLines
from xrpl.models.transactions import TrustSetFlag


import requests
import os
import json

RLUSD_ISSUER = "rEBQEFvhgZKEbUMSFcwe5SM7FyEDN26zRL"
CLIENT = JsonRpcClient("https://s.altnet.rippletest.net:51234")
app = Flask(__name__)
CORS(app)

WALLETS = {}
ESCROWS = {}

WALLETS_FILE = "wallets.json"
ESCROWS_FILE = "escrows.json"

# RLUSD stuff
ISSUER_ADDRESS = "rEBQEFvhgZKEbUMSFcwe5SM7FyEDN26zRL"
ISSUER_SEED = "sEd7puA5JQz7znDjUHPZMLVJhzv8pen"  

def allow_rippling(wallet, peer_address):
    trust_set = TrustSet(
        account=wallet.classic_address,
        limit_amount=IssuedCurrencyAmount(
            currency="USD",
            issuer=peer_address,
            value="1000000"
        ),
        flags=TrustSetFlag.TF_CLEAR_NO_RIPPLE
    )
    return submit_and_wait(trust_set, CLIENT, wallet)


@app.route("/create_trustline", methods=["POST"])
def create_trustline():
    data = request.json
    address = data.get("address")
    secret = data.get("secret")
    issuer = data.get("issuer")

    if not all([address, secret, issuer]):
        return jsonify({"error": "Missing address, secret, or issuer"}), 400

    wallet = Wallet.from_seed(secret)

    trust_set = TrustSet(
        account=address,
        limit_amount={
            "currency": "USD",
            "issuer": issuer,
            "value": "1000000"
        }
    )

    try:
        response = submit_and_wait(trust_set, CLIENT, wallet)
        allow_rippling(wallet, issuer)
        return jsonify({"result": response.result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/send_rlusd", methods=["POST"])
def send_rlusd():
    data = request.json
    destination = data.get("destination")
    amount = data.get("amount")

    if not destination or not amount:
        return jsonify({"error": "Missing destination or amount"}), 400

    issuer_wallet = Wallet.from_seed(ISSUER_SEED)

    try:
        payment = Payment(
            account=issuer_wallet.classic_address,
            destination=destination,
            amount=IssuedCurrencyAmount(
                currency="USD",
                issuer=issuer_wallet.classic_address,
                value=str(amount)
            )
        )
        response = submit_and_wait(payment, CLIENT, issuer_wallet)
        allow_rippling(issuer_wallet, destination)
        return jsonify({
            "success": True,
            "tx_hash": response.result["hash"],
            "destination": destination,
            "amount": amount
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def save_wallets():
    with open(WALLETS_FILE, "w") as f:
        # Save only seed to keep it simple and secure enough for testnet
        json.dump({addr: {"seed": w.seed} for addr, w in WALLETS.items()}, f, indent=2)

def save_escrows():
    with open(ESCROWS_FILE, "w") as f:
        json.dump(ESCROWS, f, indent=2)

@app.route("/")
def index():
    return "✅ XRPL Aid Backend is Running!"

@app.route("/create_wallet", methods=["POST"])
def api_create_wallet():
    wallet = create_wallet()
    WALLETS[wallet.classic_address] = wallet
    save_wallets()
    return jsonify({"address": wallet.classic_address, "secret": wallet.seed})

@app.route("/check_balances", methods=["POST"])
def check_balances():
    data = request.json
    wallet_address = data.get("wallet_address")
    
    if not wallet_address:
        return jsonify({"error": "Wallet address is required"}), 400
    
    try:
        # Get XRP balance
        xrp_balance = get_xrp_balance(wallet_address)
        
        # Get RLUSD balance
        rlusd_balance = get_rlusd_balance(wallet_address)
        
        return jsonify({
            "wallet_address": wallet_address,
            "xrp_balance": xrp_balance,
            "rlusd_balance": rlusd_balance,
            "success": True
        })
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "success": False
        }), 500

def get_xrp_balance(address):
    """Get XRP balance for an address"""
    try:
        req = AccountInfo(account=address, ledger_index="validated", strict=True)
        response = CLIENT.request(req)

        if "account_data" not in response.result:
            return 0.0  # Account not found or unfunded

        balance_drops = int(response.result["account_data"]["Balance"])
        return balance_drops / 1_000_000  # Convert drops to XRP
    except Exception as e:
        print(f"Error getting XRP balance: {str(e)}")
        return 0.0

def get_rlusd_balance(address):
    """Get RLUSD balance for an address"""
    try:
        req = AccountLines(
            account=address,
            ledger_index="validated",
            peer=RLUSD_ISSUER
        )
        response = CLIENT.request(req)
        
        if "lines" not in response.result:
            return 0.0  # No trust lines
        
        for line in response.result["lines"]:
            if line["currency"] == "USD":
                return float(line["balance"])
        
        return 0.0  # No RLUSD trust line
    
    except Exception as e:
        print(f"Error getting RLUSD balance: {str(e)}")
        return 0.0

@app.route("/fund_wallet", methods=["POST"])
def fund_wallet():
    data = request.json
    address = data.get("address")
    if not address:
        return jsonify({"error": "Missing wallet address"}), 400

    faucet_url = "https://faucet.altnet.rippletest.net/accounts"
    try:
        response = requests.post(faucet_url, json={"destination": address})
        if response.status_code != 200:
            return jsonify({"error": f"Faucet returned status {response.status_code}"}), 500

        try:
            response_data = response.json()
        except Exception as e:
            return jsonify({"error": "Faucet response invalid JSON or empty"}), 500

        if "account" in response_data:
            return jsonify({"success": True, "message": f"Test XRP sent to {address}"})
        else:
            return jsonify({"success": False, "error": response_data}), 500
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/setup_trustline", methods=["POST"])
def api_setup_trustline():
    data = request.json
    address = data["address"]
    issuer = data["issuer"]
    wallet = WALLETS.get(address)
    if not wallet:
        return jsonify({"error": "Wallet not found"}), 400
    result = setup_trustline(wallet, issuer)
    return jsonify({"result": result.result})

@app.route("/deposit_escrow", methods=["POST"])
def api_deposit_escrow():
    try:
        data = request.json
        sender_addr = data["sender"]
        dest_addr = data["receiver"]
        amount = data["amount"]
        currency = data.get("currency", "USD")

        sender_wallet = WALLETS.get(sender_addr)
        if not sender_wallet:
            return jsonify({"error": "Sender wallet not found"}), 400

        escrow_result = create_escrow(sender_wallet, dest_addr, amount, currency)
        escrow_seq = escrow_result.result["Sequence"]
        ESCROWS[str(escrow_seq)] = {"owner": sender_addr, "dest": dest_addr}
        save_escrows()
        return jsonify({"escrow_sequence": escrow_seq, "result": escrow_result.result, "success": True})

    except ValueError as ve:
        return jsonify({"error": str(ve), "success": False}), 400

    except Exception as e:
        return jsonify({"error": f"Unexpected error: {str(e)}", "success": False}), 500

@app.route("/claim_funds", methods=["POST"])
def api_claim_funds():
    data = request.json
    escrow_seq = str(data["escrow_sequence"])
    claimer_addr = data["claimer"]
    did = data["did"]

    if not verify_did(did):
        return jsonify({"error": "DID verification failed"}), 403

    escrow_info = ESCROWS.get(escrow_seq)
    if not escrow_info:
        return jsonify({"error": "Escrow not found"}), 404

    if claimer_addr != escrow_info["dest"]:
        return jsonify({"error": "Unauthorized claimer"}), 403

    claimer_wallet = WALLETS.get(claimer_addr)
    if not claimer_wallet:
        return jsonify({"error": "Claimer wallet not found"}), 400

    finish_result = finish_escrow(claimer_wallet, escrow_info["owner"], int(escrow_seq))
    return jsonify({"result": finish_result.result})

@app.route("/transfer_rlusd", methods=["POST"])
def transfer_rlusd():
    from xrpl.wallet import Wallet
    from xrpl.models.transactions import Payment
    from xrpl.transaction import submit_and_wait
    from xrpl.models.amounts import IssuedCurrencyAmount

    data = request.json
    sender_seed = data.get("sender_seed")
    receiver_address = data.get("receiver_address")
    amount = data.get("amount")

    if not sender_seed or not receiver_address or not amount:
        return jsonify({"success": False, "error": "Missing required fields"}), 400

    try:
        sender_wallet = Wallet.from_seed(sender_seed)

        # 👇 Enable rippling for sender if not already
        issuer_wallet = Wallet.from_seed(ISSUER_SEED)
        allow_rippling(issuer_wallet, sender_wallet.classic_address)

        # Create RLUSD IOU
        iou_amount = IssuedCurrencyAmount(
            currency="USD",
            issuer=ISSUER_ADDRESS,
            value=str(amount)
        )

        payment = Payment(
            account=sender_wallet.classic_address,
            destination=receiver_address,
            amount=iou_amount,
            send_max=iou_amount
        )

        response = submit_and_wait(payment, CLIENT, sender_wallet)

        return jsonify({
            "success": True,
            "result": response.result
        })

    except Exception as e:
        print(f"[transfer_rlusd] Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500



@app.route("/dev")
def dev_dashboard():
    wallets_info = [
        {
            "address": w.classic_address,
            "secret": w.seed,
            "balance": get_xrp_balance(w.classic_address)
        }
        for w in WALLETS.values()
    ]
    escrows_info = [
        {"sequence": seq, "owner": info["owner"], "dest": info["dest"]}
        for seq, info in ESCROWS.items()
    ]

    html = """
    <html>
      <head>
        <title>Backend Developer Dashboard</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 2rem; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 2rem; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Developer Dashboard</h1>

        <h2>Wallets ({{ wallets|length }})</h2>
        <table>
        <tr><th>Address</th><th>Secret</th><th>Balance (XRP)</th></tr>
        {% for w in wallets %}
        <tr>
            <td>{{ w.address }}</td>
            <td>{{ w.secret }}</td>
            <td>{{ w.balance }}</td>
        </tr>
        {% endfor %}
        </table>

        <h2>Escrows ({{ escrows|length }})</h2>
        <table>
          <tr><th>Sequence</th><th>Owner</th><th>Destination</th></tr>
          {% for e in escrows %}
          <tr>
            <td>{{ e.sequence }}</td>
            <td>{{ e.owner }}</td>
            <td>{{ e.dest }}</td>
          </tr>
          {% endfor %}
        </table>
      </body>
    </html>
    """

    return render_template_string(html, wallets=wallets_info, escrows=escrows_info)

if __name__ == "__main__":
    app.run(port=8000, debug=True, use_reloader=False)