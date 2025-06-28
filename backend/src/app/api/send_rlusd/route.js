import { NextResponse } from 'next/server'
import { Wallet, Payment, IssuedCurrencyAmount } from 'xrpl'
import { CLIENT } from '@/lib/xrplClient'

export async function POST(req) {
  const { destination, amount } = await req.json()
  const issuerSeed = process.env.ISSUER_SEED
  const issuer = Wallet.fromSeed(issuerSeed)
  const payment = new Payment({
    account: issuer.classic_address,
    destination,
    amount: new IssuedCurrencyAmount({ currency:'USD', issuer: issuer.classic_address, value: amount })
  })
  await CLIENT.connect()
  const res = await CLIENT.submitAndWait(payment, { wallet: issuer })
  return NextResponse.json({ tx: res.result.hash })
}
