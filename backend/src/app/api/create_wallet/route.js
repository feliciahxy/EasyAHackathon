// app/api/create_wallet/route.js
import { NextResponse } from 'next/server'
import { Wallet } from 'xrpl'
import { CLIENT } from '@/lib/xrplClient'
import { readJSON, writeJSON } from '@/lib/storage'

export async function POST() {
  const wallet = Wallet.generate()
  await CLIENT.connect()
  await CLIENT.fundWallet(wallet) // Automatically fund with Testnet XRP
  const store = await readJSON('wallets.json')
  store[wallet.classicAddress] = { seed: wallet.seed }
  await writeJSON('wallets.json', store)
  return NextResponse.json({ address: wallet.classicAddress, seed: wallet.seed })
}
