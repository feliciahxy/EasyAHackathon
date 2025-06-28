// app/api/claim_funds/route.js
import { NextResponse } from 'next/server'
import { finishEscrow } from '@/lib/escrowLogic'
import { readJSON } from '@/lib/storage'

export async function POST(req) {
  try {
    const { escrow_sequence, claimer, did } = await req.json()

    // Optionally verify DID (replace with your actual logic)
    if (did !== 'valid') {
      return NextResponse.json({ error: 'DID verification failed' }, { status: 403 })
    }

    // Load escrow info
    const escrows = await readJSON('escrows.json', {})
    const escrow = escrows[escrow_sequence]
    if (!escrow) {
      return NextResponse.json({ error: 'Escrow not found' }, { status: 404 })
    }

    if (claimer !== escrow.dest) {
      return NextResponse.json({ error: 'Unauthorized claimer' }, { status: 403 })
    }

    // Load claimer seed
    const wallets = await readJSON('wallets.json', {})
    const walletInfo = wallets[claimer]
    if (!walletInfo || !walletInfo.seed) {
      return NextResponse.json({ error: 'Claimer wallet not found' }, { status: 400 })
    }

    const result = await finishEscrow(walletInfo.seed, escrow.owner, parseInt(escrow_sequence))

    return NextResponse.json({ success: true, result: result.result })

  } catch (e) {
    return NextResponse.json({ error: e.message, success: false }, { status: 500 })
  }
}
