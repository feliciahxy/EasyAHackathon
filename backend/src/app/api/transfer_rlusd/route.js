import { NextResponse } from 'next/server'
import { Wallet, Payment, IssuedCurrencyAmount, submitAndWait } from 'xrpl'
import { CLIENT } from '@/lib/xrplClient'
import { allowRippling } from '@/lib/xrplHelpers'

// RLUSD issuer info
const ISSUER_SEED = 'sEd7puA5JQz7znDjUHPZMLVJhzv8pen'
const ISSUER_ADDRESS = 'rEBQEFvhgZKEbUMSFcwe5SM7FyEDN26zRL'

export async function POST(request) {
  try {
    const { sender_seed, receiver_address, amount } = await request.json()

    if (!sender_seed || !receiver_address || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const senderWallet = Wallet.fromSeed(sender_seed)
    const issuerWallet = Wallet.fromSeed(ISSUER_SEED)

    // Ensure sender can receive IOU by allowing rippling from issuer to sender
    await allowRippling(issuerWallet, senderWallet.classicAddress)

    const iouAmount = {
      currency: 'USD',
      issuer: ISSUER_ADDRESS,
      value: String(amount)
    }

    const payment = Payment.from({
      account: senderWallet.classicAddress,
      destination: receiver_address,
      amount: iouAmount,
      sendMax: iouAmount
    })

    const result = await submitAndWait(payment, CLIENT, senderWallet)

    return NextResponse.json({
      success: true,
      result: result.result
    })
  } catch (err) {
    console.error('[transfer_rlusd] Error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
