import { NextResponse } from 'next/server'
import { Wallet, Payment, TrustSet, IssuedCurrencyAmount } from 'xrpl'
import { CLIENT } from '@/lib/xrplClient'

export async function POST(req) {
  const { seed, issuer, limit } = await req.json()
  const wallet = Wallet.fromSeed(seed)
  const tx = new TrustSet({
    account: wallet.classic_address,
    limitAmount: new IssuedCurrencyAmount({ currency:'USD', issuer, value: limit })
  })
  await CLIENT.connect()
  const res = await CLIENT.submitAndWait(tx, { wallet })
  return NextResponse.json(res.result)
}
