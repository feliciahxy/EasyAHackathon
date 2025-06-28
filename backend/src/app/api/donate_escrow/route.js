import { NextResponse } from 'next/server'
import { Wallet } from 'xrpl'
import { createEscrow } from '@/lib/escrow'
import { loadWallets, saveEscrows, loadEscrows } from '@/lib/storage'

export async function POST(request) {
  try {
    const { sender, receiver, amount, currency = 'USD' } = await request.json()

    const wallets = await loadWallets()
    const senderWalletData = wallets[sender]

    if (!senderWalletData) {
      return NextResponse.json({ error: 'Sender wallet not found' }, { status: 400 })
    }

    const senderWallet = Wallet.fromSeed(senderWalletData.seed)

    const escrowResult = await createEscrow(senderWallet, receiver, amount, currency)

    const escrows = await loadEscrows()
    const sequence = escrowResult.result.Sequence
    escrows[sequence] = {
      owner: sender,
      dest: receiver,
      amount,
      currency
    }

    await saveEscrows(escrows)

    return NextResponse.json({
      success: true,
      escrow_sequence: sequence,
      result: escrowResult.result
    })
  } catch (err) {
    return NextResponse.json({ error: err.message, success: false }, { status: 500 })
  }
}
