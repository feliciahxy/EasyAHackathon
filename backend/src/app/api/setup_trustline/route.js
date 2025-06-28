// app/api/setup_trustline/route.js
import { NextResponse } from 'next/server'
import { Wallet, TrustSet, TrustSetFlag } from 'xrpl'
import { CLIENT } from '@/lib/xrplClient'
import { loadWallets } from '@/lib/storage'

export async function POST(request) {
  try {
    const { address, issuer } = await request.json()

    const wallets = await loadWallets()
    const stored = wallets[address]

    if (!stored) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 400 })
    }

    const wallet = Wallet.fromSeed(stored.seed)

    const trustSetTx = new TrustSet({
      account: wallet.classicAddress,
      limit_amount: {
        currency: 'USD',
        issuer: issuer,
        value: '1000000',
      },
      flags: TrustSetFlag.TF_CLEAR_NO_RIPPLE, // Enable rippling if needed
    })

    await CLIENT.connect()
    const { result } = await CLIENT.submitAndWait(trustSetTx, { wallet })

    return NextResponse.json({ result, success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
